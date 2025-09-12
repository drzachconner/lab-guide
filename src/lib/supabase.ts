import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zhdjvfylxgtiphldjtqf.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZGp2ZnlseGd0aXBobGRqdHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNDMzODEsImV4cCI6MjA3MjgxOTM4MX0.VKESaxfzbabjj3Quz888Pv_N7WO8Pdws9zPxOFRmGhI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add type definitions
export type LabPanel = {
  id: string
  fullscript_lab_id: string | null
  name: string
  description: string | null
  base_price: number
  suggested_service_fee: number
  biomarkers: string[]
  category: string
  lab_provider: string
  sample_type: string
  turnaround_days: number | null
  fasting_required: boolean
  is_active: boolean
}

export type Profile = {
  id: string
  fullscript_patient_id: string | null
  dispensary_url: string | null
  default_discount: number
}

export type Order = {
  id: string
  user_id: string
  order_number: string
  status: string
  total_amount: number
  lab_fee: number | null
  authorization_fee: number | null
  fullscript_order_id: string | null
}