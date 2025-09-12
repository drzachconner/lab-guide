import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useFullscript() {
  const [loading, setLoading] = useState(false)
  
  async function createLabPlan(labIds: string[], zipCode: string) {
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase.functions.invoke('create-fullscript-plan', {
      body: { 
        labIds, 
        userId: user?.id,
        zipCode 
      }
    })
    
    setLoading(false)
    return { data, error }
  }
  
  return { createLabPlan, loading }
}