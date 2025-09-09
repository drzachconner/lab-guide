import { useState, useEffect } from 'react';
import { generateSupplementLink, getFeatureAccess } from '@/utils/supplementLinks';

interface SupplementRecommendation {
  name: string;
  dosage?: string;
  timing?: string;
  url: string;
  clinicCommission: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface UseSupplementRecommendationsProps {
  clinicContext?: {
    fullscripts_dispensary_url?: string;
    name: string;
    id: string;
  };
  labAnalysis?: any;
}

export const useSupplementRecommendations = ({ 
  clinicContext, 
  labAnalysis 
}: UseSupplementRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<SupplementRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const features = getFeatureAccess(clinicContext);

  const generateRecommendations = (analysis: any): SupplementRecommendation[] => {
    if (!analysis) return [];

    // This would normally come from AI analysis
    const baseRecommendations = [
      {
        name: 'Vitamin D3',
        priority: 'high' as const,
        dosage: features.detailedDosageRecommendations ? '4000 IU daily' : undefined,
        timing: features.detailedDosageRecommendations ? 'With breakfast' : undefined,
      },
      {
        name: 'Magnesium Glycinate',
        priority: 'medium' as const,
        dosage: features.detailedDosageRecommendations ? '400mg before bed' : undefined,
        timing: features.detailedDosageRecommendations ? 'Evening' : undefined,
      },
      {
        name: 'Omega-3 EPA/DHA',
        priority: 'high' as const,
        dosage: features.detailedDosageRecommendations ? '2000mg EPA, 1000mg DHA' : undefined,
        timing: features.detailedDosageRecommendations ? 'With meals' : undefined,
      }
    ];

    return baseRecommendations.map(rec => {
      const link = generateSupplementLink(
        rec.name, 
        clinicContext?.fullscripts_dispensary_url
      );
      
      return {
        ...rec,
        url: link.url,
        clinicCommission: link.clinicCommission || false
      };
    });
  };

  const refreshRecommendations = () => {
    setLoading(true);
    try {
      const newRecommendations = generateRecommendations(labAnalysis);
      setRecommendations(newRecommendations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (labAnalysis) {
      refreshRecommendations();
    }
  }, [labAnalysis, clinicContext]);

  const openSupplementLink = (url: string) => {
    // Always open supplement links in new tab to preserve user's place
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getSupplementNote = () => {
    if (clinicContext?.fullscripts_dispensary_url) {
      return `Supplements purchased through ${clinicContext.name}'s dispensary support your healthcare provider.`;
    }
    return "These supplement recommendations are for informational purposes. Consult your healthcare provider before starting any new supplements.";
  };

  return {
    recommendations,
    loading,
    features,
    refreshRecommendations,
    openSupplementLink,
    supplementNote: getSupplementNote(),
    hasClinicDispensary: !!clinicContext?.fullscripts_dispensary_url
  };
};