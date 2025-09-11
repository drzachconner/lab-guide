import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ConsentStatus {
  hasConsented: boolean;
  consentedAt?: string;
  loading: boolean;
}

export function useConsentStatus() {
  const [status, setStatus] = useState<ConsentStatus>({
    hasConsented: false,
    loading: true
  });
  
  const { user } = useAuth();

  const checkConsentStatus = async () => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));
      
      // Check if user has consented to de-identified processing
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Check if profile has consent fields
      const hasConsented = (profile as any)?.consent_deidentified_processing === true;
      const consentedAt = (profile as any)?.consent_timestamp;

      setStatus({
        hasConsented,
        consentedAt,
        loading: false
      });

    } catch (error) {
      console.error('Error checking consent status:', error);
      setStatus({
        hasConsented: false,
        loading: false
      });
    }
  };

  const recordConsent = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          consent_deidentified_processing: true,
          consent_timestamp: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await checkConsentStatus();
      return true;
    } catch (error) {
      console.error('Error recording consent:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      checkConsentStatus();
    }
  }, [user]);

  return {
    ...status,
    recordConsent,
    refreshConsentStatus: checkConsentStatus
  };
}