import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface LabReport {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ai_analysis?: any;
  findings?: string;
  recommendations?: string;
  created_at: string;
  updated_at: string;
}

export function useLabReports() {
  const [reports, setReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lab_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data || []) as LabReport[]);
    } catch (error: any) {
      toast({
        title: "Error fetching reports",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadReport = async (file: File, title: string, description?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lab-reports')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lab-reports')
        .getPublicUrl(filePath);

      // Create report record
      const { data, error } = await supabase
        .from('lab_reports')
        .insert({
          user_id: user.id,
          title,
          description,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          status: 'processing'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report uploaded successfully",
        description: "Your lab report has been uploaded and AI analysis is starting..."
      });

      // Start AI analysis automatically
      try {
        await startAnalysis(data.id);
      } catch (analysisError: any) {
        console.error('Analysis failed:', analysisError);
        toast({
          title: "Analysis failed",
          description: "Upload successful but AI analysis encountered an error. Please try again.",
          variant: "destructive"
        });
      }

      // Refresh reports list
      await fetchReports();
      return data;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const startAnalysis = async (reportId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Mock patient profile and lab results for demo
      const mockPatientProfile = {
        age: 35,
        sex: 'female',
        height_cm: 165,
        weight_kg: 60,
        conditions: [],
        medications: [],
        allergies: [],
        diet_pattern: 'balanced',
        goals: ['optimize energy', 'improve sleep', 'enhance performance']
      };

      const mockLabResults = [
        { name: 'Ferritin', value: 18, units: 'ng/mL', ref_low: 15, ref_high: 400, collected_at: new Date().toISOString(), lab: 'LabCorp' },
        { name: 'Vitamin D', value: 22, units: 'ng/mL', ref_low: 20, ref_high: 100, collected_at: new Date().toISOString(), lab: 'LabCorp' },
        { name: 'Fasting Glucose', value: 88, units: 'mg/dL', ref_low: 70, ref_high: 100, collected_at: new Date().toISOString(), lab: 'LabCorp' },
        { name: 'HDL Cholesterol', value: 65, units: 'mg/dL', ref_low: 40, ref_high: 200, collected_at: new Date().toISOString(), lab: 'LabCorp' }
      ];

      const { data, error } = await supabase.functions.invoke('analyze-lab-report-ai', {
        body: {
          labReportId: reportId,
          patientProfile: mockPatientProfile,
          labResults: mockLabResults,
          functionalRanges: [
            { name: 'Ferritin', functional_low: 70, functional_high: 150 },
            { name: 'Vitamin D', functional_low: 50, functional_high: 80 }
          ]
        }
      });

      if (error) throw error;

      toast({
        title: "Analysis completed",
        description: "Your lab report has been analyzed and recommendations are ready!"
      });

      await fetchReports();
      return data;
    } catch (error: any) {
      // Update status to failed
      await supabase
        .from('lab_reports')
        .update({ status: 'failed' })
        .eq('id', reportId);
        
      throw error;
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('lab_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Report deleted",
        description: "Lab report has been successfully deleted."
      });

      await fetchReports();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  return {
    reports,
    loading,
    uploadReport,
    deleteReport,
    startAnalysis,
    refreshReports: fetchReports
  };
}