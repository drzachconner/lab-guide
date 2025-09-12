import catalogData from '@/config/labs-catalog-expanded.json';
import fullscriptCatalog from '@/config/fullscript-catalog.json';
import fullscriptCatalogReplacement from '@/config/fullscript-catalog-replacement.json';
import { computeRetailPrice, type PricingStrategy, type Fees, type PricingDefaults } from './pricing';
import { parseCatalogTextBasic } from '@/utils/localCatalogParser';

export interface LabPanel {
  id: string;
  display_name: string;
  fs_sku: string;
  category: string;
  subcategory?: string;
  specimen: string;
  fasting_required: boolean;
  turnaround_days: string;
  aliases: string[];
  biomarkers?: string[];
  reference_vendor?: string;
  reference_price_usd?: number | null;
  pricing: PricingStrategy;
  notes: string;
  clinical_significance?: string;
  popular?: boolean;
  lab_provider?: string;
  bundle_components?: string[];
}

export interface CatalogConfig {
  currency: string;
  default_fees: Fees;
  pricing_defaults: PricingDefaults;
  panels: LabPanel[];
}

export interface PricedPanel extends LabPanel {
  computed_price: number;
  price_breakdown: {
    fs_base_cost_usd: number;
    absorbed_fees_usd: number;
    reference_used: number | null;
  };
  is_higher_than_reference?: boolean;
}

class CatalogService {
  private config: CatalogConfig;
  private fullscriptData: any;
  private initialized = false;

  constructor() {
    this.config = catalogData as CatalogConfig;
    // Use the built catalog JSON directly - contains all 1000+ panels
    this.fullscriptData = (fullscriptCatalog as any)?.panels?.length
      ? (fullscriptCatalog as any)
      : {};
    console.log(`Catalog loaded with ${this.fullscriptData?.panels?.length || 0} Fullscript panels`);
  }

  // Allow runtime injection/override of Fullscript catalog (e.g., parsed from text)
  setFullscriptData(data: any) {
    this.fullscriptData = data || {};
  }

  getAllPanels(): LabPanel[] {
    // Combine original panels with Fullscript panels
    const originalPanels = this.config.panels;
    const fullscriptPanels = this.convertFullscriptPanels();
    return [...originalPanels, ...fullscriptPanels];
  }

  private convertFullscriptPanels(): LabPanel[] {
    if (!this.fullscriptData?.panels) return [];
    
    return this.fullscriptData.panels.map((fsPanel: any) => ({
      id: fsPanel.id,
      display_name: fsPanel.display_name || fsPanel.name,
      fs_sku: fsPanel.id.replace('fs-', 'FS-'),
      category: fsPanel.category || 'Laboratory Tests',
      subcategory: fsPanel.subcategory,
      specimen: fsPanel.specimen || 'Serum',
      fasting_required: fsPanel.fasting_required || false,
      turnaround_days: fsPanel.turnaround_days || '1-3 business days',
      aliases: fsPanel.aliases || [fsPanel.name || fsPanel.display_name],
      biomarkers: fsPanel.biomarkers || [],
      reference_vendor: fsPanel.providers?.[0]?.name || fsPanel.lab_provider || 'Multiple Providers',
      reference_price_usd: fsPanel.providers?.[0]?.price || null,
      pricing: { 
        strategy: 'reference_undercut', 
        undercut_percent: 5, 
        min_margin_usd: 10 
      } as PricingStrategy,
      notes: fsPanel.notes || `Available from ${fsPanel.providers?.length || 1} provider(s).`,
      clinical_significance: fsPanel.clinical_significance || `Lab panel with multiple biomarkers.`,
      popular: fsPanel.popular || ['Basic Metabolic Panel', 'CBC', 'Lipid Panel', 'DUTCH', 'Thyroid'].some(popular => 
        (fsPanel.name || fsPanel.display_name || '').toLowerCase().includes(popular.toLowerCase())
      ),
      lab_provider: fsPanel.lab_provider || fsPanel.providers?.[0]?.name || 'Multiple Providers',
    }));
  }

  getPanelById(id: string): LabPanel | null {
    // Check original panels first
    const originalPanel = this.config.panels.find(panel => panel.id === id);
    if (originalPanel) return originalPanel;
    
    // Check Fullscript panels
    const allPanels = this.getAllPanels();
    return allPanels.find(panel => panel.id === id) || null;
  }

  getPanelsByCategory(category: string): LabPanel[] {
    return this.getAllPanels().filter(panel => panel.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(this.getAllPanels().map(panel => panel.category));
    return Array.from(categories).sort();
  }

  searchPanels(query: string): LabPanel[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPanels().filter(panel => {
      return (
        panel.display_name.toLowerCase().includes(lowerQuery) ||
        panel.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
        panel.notes.toLowerCase().includes(lowerQuery) ||
        panel.category.toLowerCase().includes(lowerQuery) ||
        panel.subcategory?.toLowerCase().includes(lowerQuery) ||
        panel.biomarkers?.some(marker => marker.toLowerCase().includes(lowerQuery)) ||
        panel.clinical_significance?.toLowerCase().includes(lowerQuery) ||
        panel.lab_provider?.toLowerCase().includes(lowerQuery)
      );
    });
  }

  getSubcategories(category?: string): string[] {
    const allPanels = this.getAllPanels();
    let panels = category && category !== 'all' ? 
      allPanels.filter(panel => panel.category === category) : 
      allPanels;
    
    const subcategories = new Set(
      panels
        .map(panel => panel.subcategory)
        .filter((sub): sub is string => !!sub)
    );
    return Array.from(subcategories).sort();
  }

  getPanelsBySubcategory(subcategory: string): LabPanel[] {
    return this.getAllPanels().filter(panel => panel.subcategory === subcategory);
  }

  getPopularPanels(): LabPanel[] {
    return this.getAllPanels().filter(panel => panel.popular === true);
  }

  getPanelsBySpecimen(specimen: string): LabPanel[] {
    return this.getAllPanels().filter(panel => 
      panel.specimen.toLowerCase().includes(specimen.toLowerCase())
    );
  }

  getPanelsByFastingRequirement(fastingRequired: boolean): LabPanel[] {
    return this.getAllPanels().filter(panel => panel.fasting_required === fastingRequired);
  }

  getPanelsByTurnaroundTime(maxDays: number): LabPanel[] {
    return this.getAllPanels().filter(panel => {
      const turnaround = panel.turnaround_days;
      const matches = turnaround.match(/(\d+)/);
      if (matches) {
        const days = parseInt(matches[1]);
        return days <= maxDays;
      }
      return false;
    });
  }

  sortPanels(panels: LabPanel[], sortBy: 'name' | 'price' | 'category' | 'turnaround' | 'popular'): LabPanel[] {
    return [...panels].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.display_name.localeCompare(b.display_name);
        case 'category':
          return a.category.localeCompare(b.category) || a.display_name.localeCompare(b.display_name);
        case 'turnaround':
          const aTurnaround = parseInt(a.turnaround_days.match(/(\d+)/)?.[1] || '0');
          const bTurnaround = parseInt(b.turnaround_days.match(/(\d+)/)?.[1] || '0');
          return aTurnaround - bTurnaround;
        case 'popular':
          const aPopular = a.popular ? 1 : 0;
          const bPopular = b.popular ? 1 : 0;
          return bPopular - aPopular || a.display_name.localeCompare(b.display_name);
        default:
          return 0;
      }
    });
  }

  // Mock function to simulate getting Fullscript base cost
  // In real implementation, this would call the Fullscript API
  private async getFullscriptBaseCost(fs_sku: string): Promise<number> {
    // Mock pricing based on panel type for demonstration
    const mockPricing: Record<string, number> = {
      'FS-LAB-CBC': 45,
      'FS-LAB-CMP': 55,
      'FS-LAB-LIPID': 35,
      'FS-LAB-HBA1C': 25,
      'FS-LAB-THY-CORE': 85,
      'FS-LAB-VITD25': 30,
      'FS-LAB-HSCRP': 20,
      'FS-LAB-INSULIN': 40,
      'FS-LAB-HCY': 45,
      'FS-LAB-OM3-RBC': 120,
      'FS-LAB-B12': 25,
      'FS-LAB-FOLATE': 30,
    };
    
    return mockPricing[fs_sku] || 50; // Default fallback
  }

  async computePanelPrice(panelId: string): Promise<PricedPanel | null> {
    const panel = this.getPanelById(panelId);
    if (!panel) return null;

    // Handle bundles
    if (panel.bundle_components) {
      return this.computeBundlePrice(panel);
    }

    const fs_base_cost = await this.getFullscriptBaseCost(panel.fs_sku);
    
    const result = computeRetailPrice({
      fs_base_cost_usd: fs_base_cost,
      reference_price_usd: panel.reference_price_usd,
      strategy: panel.pricing,
      defaults: this.config.pricing_defaults,
      fees: this.config.default_fees,
    });

    const is_higher_than_reference = panel.reference_price_usd ? 
      result.price_usd > panel.reference_price_usd : false;

    return {
      ...panel,
      computed_price: result.price_usd,
      price_breakdown: result.breakdown,
      is_higher_than_reference,
    };
  }

  private async computeBundlePrice(bundlePanel: LabPanel): Promise<PricedPanel> {
    if (!bundlePanel.bundle_components) {
      throw new Error('Bundle panel must have bundle_components');
    }

    // Get component costs
    let totalComponentCost = 0;
    for (const componentId of bundlePanel.bundle_components) {
      const component = this.getPanelById(componentId);
      if (component) {
        const componentCost = await this.getFullscriptBaseCost(component.fs_sku);
        totalComponentCost += componentCost;
      }
    }

    const result = computeRetailPrice({
      fs_base_cost_usd: totalComponentCost,
      reference_price_usd: bundlePanel.reference_price_usd,
      strategy: bundlePanel.pricing,
      defaults: this.config.pricing_defaults,
      fees: this.config.default_fees,
    });

    const is_higher_than_reference = bundlePanel.reference_price_usd ? 
      result.price_usd > bundlePanel.reference_price_usd : false;

    return {
      ...bundlePanel,
      computed_price: result.price_usd,
      price_breakdown: result.breakdown,
      is_higher_than_reference,
    };
  }

  private async ensureLoaded() {
    // Catalog is now loaded at import time - no need for runtime fetching
    return;
  }

  // Public initializer - now a no-op since catalog loads at import
  async init() {
    return;
  }

  async computeAllPanelPrices(): Promise<PricedPanel[]> {
    const pricedPanels: PricedPanel[] = [];
    
    for (const panel of this.getAllPanels()) {
      const pricedPanel = await this.computePanelPrice(panel.id);
      if (pricedPanel) {
        pricedPanels.push(pricedPanel);
      }
    }
    
    return pricedPanels;
  }

  getConfig(): CatalogConfig {
    return this.config;
  }
}

export const catalogService = new CatalogService();