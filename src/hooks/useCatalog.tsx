import { useState, useEffect } from 'react';
import { catalogService, type PricedPanel } from '@/lib/catalogService';
import { useToast } from '@/hooks/use-toast';

export function useCatalog() {
  const [panels, setPanels] = useState<PricedPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPanels();
  }, []);

  const loadPanels = async () => {
    try {
      setLoading(true);
      setError(null);
      const pricedPanels = await catalogService.computeAllPanelPrices();
      setPanels(pricedPanels);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load lab panels';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const searchPanels = (query: string): PricedPanel[] => {
    if (!query.trim()) return panels;
    
    const lowerQuery = query.toLowerCase();
    return panels.filter(panel => {
      return (
        panel.display_name.toLowerCase().includes(lowerQuery) ||
        panel.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
        panel.notes.toLowerCase().includes(lowerQuery)
      );
    });
  };

  const getPanelsByCategory = (category: string): PricedPanel[] => {
    if (category === 'all') return panels;
    return panels.filter(panel => panel.category === category);
  };

  const getCategories = (): string[] => {
    const categories = new Set(panels.map(panel => panel.category));
    return ['all', ...Array.from(categories).sort()];
  };

  const getPanelById = (id: string): PricedPanel | undefined => {
    return panels.find(panel => panel.id === id);
  };

  const refreshPrices = async () => {
    await loadPanels();
  };

  return {
    panels,
    loading,
    error,
    searchPanels,
    getPanelsByCategory,
    getCategories,
    getPanelById,
    refreshPrices,
  };
}