import catalogData from '@/config/labs-catalog.json';
import { computeRetailPrice, type PricingStrategy, type Fees, type PricingDefaults } from './pricing';

export interface LabPanel {
  id: string;
  display_name: string;
  fs_sku: string;
  category: string;
  specimen: string;
  fasting_required: boolean;
  turnaround_days: string;
  aliases: string[];
  reference_vendor?: string;
  reference_price_usd?: number | null;
  pricing: PricingStrategy;
  notes: string;
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

  constructor() {
    this.config = catalogData as CatalogConfig;
  }

  getAllPanels(): LabPanel[] {
    return this.config.panels;
  }

  getPanelById(id: string): LabPanel | null {
    return this.config.panels.find(panel => panel.id === id) || null;
  }

  getPanelsByCategory(category: string): LabPanel[] {
    return this.config.panels.filter(panel => panel.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(this.config.panels.map(panel => panel.category));
    return Array.from(categories).sort();
  }

  searchPanels(query: string): LabPanel[] {
    const lowerQuery = query.toLowerCase();
    return this.config.panels.filter(panel => {
      return (
        panel.display_name.toLowerCase().includes(lowerQuery) ||
        panel.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
        panel.notes.toLowerCase().includes(lowerQuery)
      );
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

  async computeAllPanelPrices(): Promise<PricedPanel[]> {
    const pricedPanels: PricedPanel[] = [];
    
    for (const panel of this.config.panels) {
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