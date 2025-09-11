// src/lib/apiClient.ts
import { supabase } from "@/integrations/supabase/client";
import {
  ProfileZ, ProfileT,
  CreateProfileInput,
  LabOrderZ, LabOrderT, CreateLabOrderInput,
  InterpretationZ, InterpretationT,
} from "@/types/zod";
import { z } from "zod";

// Note: Lovable doesn't support VITE_ env variables, using hardcoded base for now
const API_BASE = "https://zhdjvfylxgtiphldjtqf.supabase.co/functions/v1";

// Generic fetch with auth + Zod validation
async function req<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>
): Promise<T> {
  // attach Supabase JWT
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const text = await res.text();

  // handle non-2xx
  if (!res.ok) {
    let detail: unknown;
    try { detail = JSON.parse(text); } catch { detail = text; }
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(detail)}`);
  }

  // No body
  if (!text) return undefined as unknown as T;

  const json = JSON.parse(text);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    console.error("Validation error for", path, parsed.error.format());
    throw new Error("ValidationError");
  }
  return parsed.data;
}

// --- Schemas to validate lists/basic returns
const ProfilesMaybeZ = z.union([ProfileZ, z.null()]);
const LabOrdersListZ = z.array(LabOrderZ);
const InterpretationsListZ = z.array(InterpretationZ);
const AnalyzeOkZ = z.object({
  interpretation_id: z.string().uuid().optional(),
  status: z.string(),
});

export const api = {
  // Auth & Profiles
  getMyProfile(): Promise<ProfileT | null> {
    return req("/me/profile", { method: "GET" }, ProfilesMaybeZ);
  },
  createMyProfile(payload: CreateProfileInput): Promise<ProfileT> {
    return req("/me/profile", { method: "POST", body: JSON.stringify(payload) }, ProfileZ);
  },

  // Lab Orders
  listOrders(): Promise<LabOrderT[]> {
    return req("/orders", { method: "GET" }, LabOrdersListZ);
  },
  createOrder(payload: CreateLabOrderInput): Promise<LabOrderT> {
    return req("/orders", { method: "POST", body: JSON.stringify(payload) }, LabOrderZ);
  },
  updateOrderStatus(orderId: string, status: LabOrderT["status"]): Promise<LabOrderT> {
    return req(`/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }, LabOrderZ);
  },

  // Interpretations
  listInterpretations(): Promise<InterpretationT[]> {
    return req("/interpretations", { method: "GET" }, InterpretationsListZ);
  },
  getInterpretation(id: string): Promise<InterpretationT> {
    return req(`/interpretations/${id}`, { method: "GET" }, InterpretationZ);
  },

  // Ops
  analyzeOrder(lab_order_id: string) {
    return req("/analyze", {
      method: "POST",
      body: JSON.stringify({ lab_order_id }),
    }, AnalyzeOkZ);
  },
};