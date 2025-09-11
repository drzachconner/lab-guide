import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Info, Clock, Droplets, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LabPanel {
  id: string;
  name: string;
  description: string;
  category: string; // Changed from literal union to string
  biomarkers: string[];
  base_price: number;
  lab_provider: string;
  sample_type: string;
  fasting_required: boolean;
  turnaround_days: number;
}

interface LabPanelBrowserProps {
  onAddToCart: (panel: LabPanel) => void;
  cartItems: LabPanel[];
}

export function LabPanelBrowser({ onAddToCart, cartItems }: LabPanelBrowserProps) {
  const [panels, setPanels] = useState<LabPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      // Mock data for popular biohacking lab panels - prioritizing 10x Health and Wellness Way panels
      const mockPanels: LabPanel[] = [
        // Top biohacking panels first
        {
          id: 'comprehensive-biohacker',
          name: 'Comprehensive Biohacker Panel',
          description: 'Complete metabolic, hormonal, and inflammatory assessment for optimal performance optimization.',
          category: 'comprehensive',
          biomarkers: ['Testosterone', 'Estradiol', 'DHEA-S', 'Cortisol', 'Insulin', 'IGF-1', 'Thyroid Panel', 'Vitamin D', 'B12', 'Folate', 'Omega-3 Index', 'CRP', 'Homocysteine'],
          base_price: 39900, // $399
          lab_provider: 'Quest',
          sample_type: 'Blood',
          fasting_required: true,
          turnaround_days: 3
        },
        {
          id: 'hormone-optimization',
          name: 'Hormone Optimization Panel',
          description: 'Complete sex hormone and stress hormone analysis for peak performance.',
          category: 'specialty',
          biomarkers: ['Total Testosterone', 'Free Testosterone', 'Estradiol', 'DHEA-S', 'Cortisol AM/PM', 'SHBG', 'LH', 'FSH'],
          base_price: 29900, // $299
          lab_provider: 'LabCorp',
          sample_type: 'Blood + Saliva',
          fasting_required: false,
          turnaround_days: 5
        },
        {
          id: 'metabolic-health-max',
          name: 'Metabolic Health Max',
          description: 'Advanced metabolic markers including insulin resistance and mitochondrial function.',
          category: 'comprehensive',
          biomarkers: ['Glucose', 'Insulin', 'HOMA-IR', 'HbA1c', 'Triglycerides', 'HDL', 'LDL', 'ApoB', 'Lp(a)', 'NMR Lipoprofile'],
          base_price: 24900, // $249
          lab_provider: 'Quest',
          sample_type: 'Blood',
          fasting_required: true,
          turnaround_days: 3
        },
        {
          id: 'thyroid-deep-dive',
          name: 'Thyroid Deep Dive',
          description: 'Comprehensive thyroid function including reverse T3 and antibodies.',
          category: 'specialty',
          biomarkers: ['TSH', 'Free T4', 'Free T3', 'Reverse T3', 'TPO Ab', 'Thyroglobulin Ab', 'TRAb'],
          base_price: 19900, // $199
          lab_provider: 'LabCorp',
          sample_type: 'Blood',
          fasting_required: false,
          turnaround_days: 4
        },
        {
          id: 'inflammation-immune',
          name: 'Inflammation & Immune Panel',
          description: 'Assess systemic inflammation and immune system function.',
          category: 'specialty',
          biomarkers: ['CRP', 'ESR', 'IL-6', 'TNF-α', 'White Blood Cell Count', 'Neutrophil/Lymphocyte Ratio', 'NK Cell Activity'],
          base_price: 22900, // $229
          lab_provider: 'Quest',
          sample_type: 'Blood',
          fasting_required: false,
          turnaround_days: 5
        },
        {
          id: 'nutrient-status-pro',
          name: 'Nutrient Status Pro',
          description: 'Comprehensive vitamin, mineral, and micronutrient analysis.',
          category: 'basic',
          biomarkers: ['Vitamin D', 'B12', 'Folate', 'B6', 'Magnesium', 'Zinc', 'Iron Studies', 'RBC Folate', 'Methylmalonic Acid'],
          base_price: 18900, // $189
          lab_provider: 'LabCorp',
          sample_type: 'Blood',
          fasting_required: false,
          turnaround_days: 3
        },
        // Basic panels
        {
          id: 'basic-metabolic',
          name: 'Basic Metabolic Panel',
          description: 'Essential metabolic markers for overall health assessment.',
          category: 'basic',
          biomarkers: ['Glucose', 'Electrolytes', 'Kidney Function', 'Liver Enzymes'],
          base_price: 8900, // $89
          lab_provider: 'Quest',
          sample_type: 'Blood',
          fasting_required: true,
          turnaround_days: 2
        },
        {
          id: 'lipid-advanced',
          name: 'Advanced Lipid Panel',
          description: 'Comprehensive cardiovascular risk assessment.',
          category: 'basic',
          biomarkers: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides', 'ApoB', 'Lp(a)', 'Particle Size'],
          base_price: 14900, // $149
          lab_provider: 'LabCorp',
          sample_type: 'Blood',
          fasting_required: true,
          turnaround_days: 3
        }
      ];
      
      setPanels(mockPanels);
    } catch (error: any) {
      console.error('Error loading panels:', error);
      toast({
        title: "Error",
        description: "Failed to load lab panels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPanels = panels.filter(panel => {
    const categoryMatch = selectedCategory === 'all' || panel.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      panel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      panel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      panel.biomarkers.some(marker => marker.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'comprehensive': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'specialty': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const isInCart = (panelId: string) => {
    return cartItems.some(item => item.id === panelId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search lab panels, biomarkers, or conditions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          All Panels
        </Button>
        <Button
          variant={selectedCategory === 'basic' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('basic')}
          size="sm"
        >
          Basic
        </Button>
        <Button
          variant={selectedCategory === 'comprehensive' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('comprehensive')}
          size="sm"
        >
          Comprehensive
        </Button>
        <Button
          variant={selectedCategory === 'specialty' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('specialty')}
          size="sm"
        >
          Specialty
        </Button>
      </div>

      {/* Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPanels.map((panel) => (
          <Card key={panel.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{panel.name}</CardTitle>
                  <Badge className={getCategoryColor(panel.category)}>
                    {panel.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(panel.base_price)}
                  </div>
                  <div className="text-xs text-muted-foreground">+ fees</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground">
                {panel.description}
              </p>

              {/* Test Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Droplets className="h-3 w-3" />
                  <span>{panel.sample_type}</span>
                  {panel.fasting_required && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <span>Fasting required</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{panel.turnaround_days} day results</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>{panel.lab_provider}</span>
                </div>
              </div>

              {/* Biomarkers */}
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {panel.biomarkers.length} Biomarkers
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {panel.biomarkers.slice(0, 3).map((marker, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {marker}
                    </Badge>
                  ))}
                  {panel.biomarkers.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{panel.biomarkers.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                onClick={() => onAddToCart(panel)}
                disabled={isInCart(panel.id)}
                className="w-full"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart(panel.id) ? 'Added to Cart' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPanels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No lab panels found in this category.
          </p>
        </div>
      )}
    </div>
  );
}