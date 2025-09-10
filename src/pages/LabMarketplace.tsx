import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, TrendingUp, Shield, Brain, Heart, Zap, Users, CheckCircle, X, Clock, Beaker, TestTube, Dna, Droplets, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ParticipantDetailsDialog, type ParticipantData } from "@/components/ParticipantDetailsDialog";
import { ReceivingAddressDialog, type AddressData } from "@/components/ReceivingAddressDialog";
import { getStateRestrictions, getStateMessage } from "@/utils/stateGating";
import { calculateLabFees, AI_INTERPRETATION_FEE } from "@/utils/labFees";

interface Biomarker {
  id: string;
  name: string;
  category: string;
  notes?: string;
}

interface Panel {
  id: string;
  name: string;
  tagline: string;
  biomarkers: string[];
  prep: string;
  addOns?: string[];
  categories: string[];
  priceMin: number;
  priceMax: number;
  popular?: boolean;
  featured?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  testType?: 'blood' | 'kit' | 'combo';
  requiresAuthorization?: boolean;
  isSpecialtyKit?: boolean;
  restrictions?: string[];
}

const BIOMARKERS: Biomarker[] = [
  // Complete Blood Count
  { id: "cbc", name: "CBC w/ Differential", category: "blood" },
  { id: "cmp", name: "Comprehensive Metabolic Panel", category: "metabolism" },
  
  // Cardiovascular
  { id: "lipid", name: "Lipid Panel", category: "cardiovascular" },
  { id: "apoB", name: "Apolipoprotein B (ApoB)", category: "cardiovascular" },
  { id: "lp-a", name: "Lipoprotein(a)", category: "cardiovascular" },
  { id: "lp-pla2", name: "Lp-PLA2", category: "cardiovascular" },
  { id: "oxidized-ldl", name: "Oxidized LDL", category: "cardiovascular" },
  
  // Metabolism & Diabetes
  { id: "hba1c", name: "HbA1c", category: "metabolism" },
  { id: "fasting-glucose", name: "Fasting Glucose", category: "metabolism" },
  { id: "fasting-insulin", name: "Fasting Insulin", category: "metabolism" },
  { id: "igf-1", name: "IGF-1", category: "metabolism" },
  
  // Inflammation
  { id: "hs-crp", name: "hs-CRP", category: "inflammation" },
  { id: "esr", name: "ESR", category: "inflammation" },
  { id: "fibrinogen", name: "Fibrinogen", category: "inflammation" },
  
  // Iron & Minerals
  { id: "ferritin", name: "Ferritin", category: "nutrients" },
  { id: "iron-tibc-sat", name: "Iron/TIBC/% Saturation", category: "nutrients" },
  { id: "rbc-magnesium", name: "RBC Magnesium", category: "nutrients" },
  { id: "zinc", name: "Zinc", category: "nutrients" },
  { id: "copper", name: "Copper", category: "nutrients" },
  { id: "ceruloplasmin", name: "Ceruloplasmin", category: "nutrients" },
  
  // B-Vitamins & Methylation
  { id: "homocysteine", name: "Homocysteine", category: "methylation" },
  
  // Methylation Genetics
  { id: "mthfr", name: "MTHFR (C677T, A1298C)", category: "genetics" },
  { id: "mtr", name: "MTR (A2756G)", category: "genetics" },
  { id: "mtrr", name: "MTRR (A66G)", category: "genetics" },
  { id: "comt", name: "COMT (V158M)", category: "genetics" },
  { id: "ahcy", name: "AHCY (rs819147)", category: "genetics" },
  { id: "b12", name: "Vitamin B12", category: "nutrients" },
  { id: "mma", name: "MMA (Methylmalonic Acid)", category: "methylation" },
  { id: "folate", name: "Folate", category: "nutrients" },
  { id: "rbc-folate", name: "RBC Folate", category: "nutrients" },
  { id: "b6-plp", name: "Vitamin B6 (PLP)", category: "nutrients" },
  { id: "b2", name: "Vitamin B2", category: "nutrients" },
  
  // Vitamins
  { id: "vitamin-d-25oh", name: "25-OH Vitamin D", category: "nutrients" },
  { id: "omega-3-index", name: "Omega-3 Index", category: "nutrients" },
  
  // Liver Function
  { id: "ggt", name: "GGT", category: "liver" },
  { id: "alt", name: "ALT", category: "liver" },
  { id: "ast", name: "AST", category: "liver" },
  { id: "bilirubin", name: "Total Bilirubin", category: "liver" },
  
  // Kidney
  { id: "uric-acid", name: "Uric Acid", category: "kidney" },
  { id: "microalbumin-creatinine", name: "Microalbumin/Creatinine", category: "kidney" },
  
  // Thyroid
  { id: "tsh", name: "TSH", category: "thyroid" },
  { id: "free-t4", name: "Free T4", category: "thyroid" },
  { id: "free-t3", name: "Free T3", category: "thyroid" },
  { id: "reverse-t3", name: "Reverse T3", category: "thyroid" },
  { id: "tpo-ab", name: "TPO Antibodies", category: "thyroid" },
  { id: "tg-ab", name: "Thyroglobulin Antibodies", category: "thyroid" },
  
  // Male Hormones
  { id: "total-testosterone", name: "Total Testosterone", category: "hormones" },
  { id: "free-testosterone", name: "Free Testosterone", category: "hormones" },
  { id: "shbg", name: "SHBG", category: "hormones" },
  { id: "sensitive-estradiol", name: "Sensitive Estradiol (E2)", category: "hormones" },
  { id: "dhea-s", name: "DHEA-S", category: "hormones" },
  { id: "lh", name: "LH", category: "hormones" },
  { id: "fsh", name: "FSH", category: "hormones" },
  { id: "prolactin", name: "Prolactin", category: "hormones" },
  { id: "psa", name: "PSA", category: "hormones" },
  
  // Female Hormones
  { id: "estradiol", name: "Estradiol", category: "hormones" },
  { id: "progesterone", name: "Progesterone", category: "hormones" },
  { id: "amh", name: "AMH", category: "hormones" },
  
  // Stress/Adrenals
  { id: "cortisol-am", name: "Cortisol AM", category: "hormones" },
  { id: "cortisol-pm", name: "Cortisol PM", category: "hormones" },
  
  // Gut & Advanced
  { id: "comprehensive-stool", name: "Comprehensive Stool Analysis", category: "gut" },
  { id: "calprotectin", name: "Calprotectin", category: "gut" },
  { id: "h-pylori", name: "H. pylori Antigen", category: "gut" },
  { id: "organic-acids", name: "Organic Acids Test (OAT)", category: "gut" },
  
  // Immune
  { id: "ana", name: "ANA Screen", category: "immune" }
];

const PANELS: Panel[] = [
  // 10X-Equivalent Methylation Panels (Featured)
  {
    id: "genetic-methylation-swab",
    name: "Genetic Methylation SNP Panel",
    tagline: "Cheek-swab DNA test for core methylation genes (MTHFR, MTR, MTRR, COMT, AHCY). Ships to you.",
    biomarkers: ["mthfr", "mtr", "mtrr", "comt", "ahcy"],
    prep: "Simple cheek swab. No fasting required.",
    addOns: ["methylation-blood-pack"],
    categories: ["featured", "genetics", "methylation"],
    priceMin: 249,
    priceMax: 299,
    popular: true,
    featured: true,
    icon: Dna,
    testType: 'kit',
    requiresAuthorization: true,
    isSpecialtyKit: true,
    restrictions: ["Specialty kit shipping not available in NY, NJ, RI, HI"]
  },
  {
    id: "methylation-combo",
    name: "Complete Methylation Analysis",
    tagline: "Genetics + blood status for comprehensive methylation optimization.",
    biomarkers: ["mthfr", "mtr", "mtrr", "comt", "ahcy", "homocysteine", "vitamin-b12", "mma", "rbc-folate", "vitamin-d-25oh", "omega-3-index"],
    prep: "DNA swab (no prep) + blood draw (10-12h fast).",
    addOns: [],
    categories: ["featured", "genetics", "methylation", "nutrients"],
    priceMin: 399,
    priceMax: 499,
    popular: true,
    featured: true,
    icon: Dna,
    testType: 'combo',
    requiresAuthorization: true,
    isSpecialtyKit: true,
    restrictions: ["Blood labs not available in NY, NJ, RI", "Kit shipping not available in NY, NJ, RI, HI"]
  },
  {
    id: "methylation-blood-pack",
    name: "Methylation Status Blood Pack",
    tagline: "Blood markers that show real-time methylation status.",
    biomarkers: ["homocysteine", "vitamin-b12", "mma", "rbc-folate", "vitamin-d-25oh", "omega-3-index"],
    prep: "10–12h fast; morning draw.",
    addOns: [],
    categories: ["featured", "methylation", "nutrients"],
    priceMin: 149,
    priceMax: 199,
    featured: true,
    icon: Droplets,
    testType: 'blood',
    requiresAuthorization: true,
    restrictions: ["Blood labs not available in NY, NJ, RI"]
  },
  {
    id: "core-optimization",
    name: "Core Optimization Baseline (Fasting)",
    tagline: "The universal starting point for biohackers",
    biomarkers: [
      "cbc", "cmp", "lipid", "apoB", "lp-a", "hba1c", "fasting-glucose",
      "fasting-insulin", "hs-crp", "ferritin", "iron-tibc-sat", "homocysteine",
      "vitamin-d-25oh", "ggt", "uric-acid", "tsh"
    ],
    prep: "10–12h fast; morning draw",
    addOns: ["omega-3-index", "microalbumin-creatinine"],
    categories: ["featured", "metabolism", "cardiovascular"],
    priceMin: 179,
    priceMax: 229,
    popular: true,
    featured: true,
    icon: TrendingUp
  },
  {
    id: "metabolic-longevity",
    name: "Metabolic & Longevity Panel", 
    tagline: "Insulin sensitivity + cardio-metabolic risk + liver detox capacity",
    biomarkers: [
      "apoB", "lp-a", "fasting-insulin", "hba1c", "hs-crp", "ggt", "alt", "ast",
      "bilirubin", "uric-acid", "igf-1", "microalbumin-creatinine", "cmp", "lipid"
    ],
    prep: "10–12h fast",
    addOns: ["lp-pla2", "oxidized-ldl"],
    categories: ["featured", "metabolism", "longevity"],
    priceMin: 219,
    priceMax: 299,
    featured: true,
    icon: Heart
  },
  {
    id: "thyroid-energy",
    name: "Thyroid & Energy Panel",
    tagline: "Fatigue, weight, hair/skin, and temperature regulation",
    biomarkers: ["tsh", "free-t4", "free-t3", "reverse-t3", "tpo-ab", "tg-ab", "ferritin", "vitamin-d-25oh", "b12"],
    prep: "Morning draw; avoid biotin 48–72 hours",
    addOns: ["zinc", "copper", "ceruloplasmin"],
    categories: ["featured", "thyroid", "energy"],
    priceMin: 129,
    priceMax: 179,
    featured: true,
    icon: Zap
  },
  {
    id: "male-hormone-optimization",
    name: "Male Hormone Optimization (18+)",
    tagline: "Strength, libido, mood, recovery",
    biomarkers: [
      "total-testosterone", "free-testosterone", "shbg", "sensitive-estradiol", 
      "dhea-s", "lh", "fsh", "prolactin", "cmp", "cbc", "lipid"
    ],
    prep: "Morning draw; no heavy training 24h prior",
    addOns: ["psa", "cortisol-am"],
    categories: ["featured", "hormones", "male"],
    priceMin: 149,
    priceMax: 219,
    featured: true,
    icon: Shield
  },
  {
    id: "female-hormone-cycle",
    name: "Female Hormone & Cycle Panel",
    tagline: "Cycle health, mood, fertility awareness",
    biomarkers: [
      "estradiol", "progesterone", "lh", "fsh", "shbg", "dhea-s", "prolactin",
      "tsh", "free-t4", "free-t3", "ferritin", "vitamin-d-25oh"
    ],
    prep: "Day 3 for baseline (FSH/LH/E2), day 19–21 for progesterone (28-day cycle)",
    addOns: ["amh", "tpo-ab"],
    categories: ["featured", "hormones", "female"],
    priceMin: 149,
    priceMax: 219,
    featured: true,
    icon: Users
  },
  {
    id: "methylation-b-vitamins",
    name: "Methylation & B-Vitamin Panel",
    tagline: "Detox & cognitive energy via methylation status",
    biomarkers: ["homocysteine", "b12", "mma", "folate", "b6-plp"],
    prep: "Morning preferred; no supplements on test morning",
    addOns: ["omega-3-index", "b2"],
    categories: ["featured", "methylation", "nutrients"],
    priceMin: 119,
    priceMax: 169,
    featured: true,
    icon: Brain
  },
  {
    id: "inflammation-immune",
    name: "Inflammation & Immune Check",
    tagline: "Silent inflammation & iron handling clarity",
    biomarkers: ["hs-crp", "esr", "ferritin", "fibrinogen", "cbc", "vitamin-d-25oh"],
    prep: "Morning preferred",
    addOns: ["lp-pla2", "ana"],
    categories: ["featured", "inflammation", "immune"],
    priceMin: 99,
    priceMax: 149,
    featured: true,
    icon: Shield
  },
  {
    id: "nutrient-status",
    name: "Nutrient Status Panel",
    tagline: "The fundamentals for recovery, sleep, and cognition",
    biomarkers: [
      "vitamin-d-25oh", "b12", "mma", "folate", "ferritin", "iron-tibc-sat", 
      "rbc-magnesium", "zinc", "copper", "ceruloplasmin", "omega-3-index"
    ],
    prep: "Morning preferred; no supplements on test morning",
    categories: ["featured", "nutrients"],
    priceMin: 149,
    priceMax: 199,
    featured: true,
    icon: TestTube
  },
  {
    id: "gut-microbiome",
    name: "Gut & Microbiome (Advanced)",
    tagline: "GI symptoms, skin, brain-gut axis, immune load",
    biomarkers: ["comprehensive-stool", "calprotectin", "h-pylori"],
    prep: "Specialty send-out; fulfillment times vary",
    addOns: ["organic-acids"],
    categories: ["advanced", "gut", "microbiome"],
    priceMin: 299,
    priceMax: 449,
    featured: false,
    icon: Beaker
  }
];

const CATEGORIES = [
  { id: "genetics", name: "Genetics & Methylation", icon: Dna, description: "MTHFR, COMT, MTR, MTRR, AHCY" },
  { id: "methylation", name: "Methylation Status", icon: Droplets, description: "Homocysteine, B12, Folate, MMA" },
  { id: "hormones", name: "Hormones", icon: Shield, description: "Male/Female, Thyroid, Cortisol" },
  { id: "metabolism", name: "Metabolism & Longevity", icon: Heart, description: "Insulin, HbA1c, ApoB, IGF-1" },
  { id: "inflammation", name: "Inflammation & Immune", icon: Shield, description: "hs-CRP, ESR, Ferritin" },
  { id: "nutrients", name: "Nutrients", icon: TestTube, description: "Vitamin D, B12, Minerals, Omega-3" },
  { id: "cardiovascular", name: "Cardiovascular", icon: Heart, description: "Lipids, ApoB, Lp(a)" },
  { id: "thyroid", name: "Thyroid & Energy", icon: Zap, description: "TSH, T3, T4, Antibodies" },
  { id: "gut", name: "Gut Health", icon: Beaker, description: "Stool Analysis, Microbiome" },
  { id: "liver", name: "Liver/Kidney", icon: TestTube, description: "Detox, Function, Filtration" }
];

const LabMarketplace = () => {
  const navigate = useNavigate();
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);  
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
  const [userState, setUserState] = useState<string>('CA'); // Default to CA, should be set by user input

  const handleOrderPanel = (panel: Panel) => {
    // Check state restrictions
    const stateRestrictions = getStateRestrictions(userState);
    
    if (panel.testType === 'blood' && !stateRestrictions.canOrderBloodLabs) {
      alert('Blood labs are not available in your state (NY, NJ, RI)');
      return;
    }
    
    if ((panel.testType === 'kit' || panel.isSpecialtyKit) && !stateRestrictions.canOrderSpecialtyKits) {
      alert('Specialty kit shipping is not available in your state (NY, NJ, RI, HI)');
      return;
    }
    
    if (panel.testType === 'combo') {
      if (!stateRestrictions.canOrderBloodLabs || !stateRestrictions.canOrderSpecialtyKits) {
        alert('This combination test is not available in your state due to restrictions on blood labs or specialty kit shipping');
        return;
      }
    }

    setSelectedPanel(panel);
    setParticipantDialogOpen(true);
  };

  const handleParticipantNext = (data: ParticipantData) => {
    setParticipantData(data);
    setParticipantDialogOpen(false);
    setAddressDialogOpen(true);
  };

  const handleAddressBack = () => {
    setAddressDialogOpen(false);
    setParticipantDialogOpen(true);
  };

  const handleAddToCart = (addressData: AddressData) => {
    // Calculate fees for this order
    if (selectedPanel) {
      const fees = calculateLabFees({
        panelPrice: selectedPanel.priceMin,
        requiresAuthorization: selectedPanel.requiresAuthorization || false,
        includesBloodDraw: selectedPanel.testType === 'blood' || selectedPanel.testType === 'combo',
        isSpecialtyKit: selectedPanel.isSpecialtyKit || false,
        includeAiInterpretation: true // Default to include AI interpretation
      });
      
      console.log("Adding to cart:", { 
        panel: selectedPanel, 
        participant: participantData, 
        address: addressData,
        fees: fees,
        totalCost: selectedPanel.priceMin + fees.total
      });
    }
    
    setAddressDialogOpen(false);
    // Reset state
    setSelectedPanel(null);
    setParticipantData(null);
  };

  const handlePanelSelect = (panel: Panel) => {
    // For now, redirect to auth with panel info
    navigate(`/auth?type=order-labs&panel=${panel.id}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getBiomarkersByIds = (ids: string[]) => {
    return ids.map(id => BIOMARKERS.find(b => b.id === id)?.name).filter(Boolean);
  };

  const featuredPanels = PANELS.filter(panel => panel.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
            <span className="text-gray-500">Biohack</span><span className="text-blue-600">Labs</span><span className="text-gray-500">.ai</span>
          </div>

          <Button 
            onClick={() => navigate('/auth')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
              Order Labs for Optimization — Not Just Diagnostics
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Precision Labs for Biohackers. <span className="text-blue-600">$19 AI Interpretation.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Order the right labs for optimization — not just diagnostics. Curated biohacker panels, plus $19 AI interpretation that turns numbers into a plan.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
              <p className="text-sm text-blue-800">
                <strong>🧬 NEW:</strong> Genetic Methylation Testing — DNA swab analysis for MTHFR, COMT, MTR, MTRR, and AHCY genes. 
                Pair with blood markers for complete methylation optimization.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('featured-panels')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              >
                Browse Panels
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/auth?type=upload-labs')}
                size="lg"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4"
              >
                Upload Labs ($19)
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Panels */}
      <section id="featured-panels" className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Biohacker Panels</h2>
            <p className="text-gray-600">Curated from leading functional medicine and performance practices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPanels.map((panel, index) => {
              const IconComponent = panel.icon;
              const keyBiomarkers = getBiomarkersByIds(panel.biomarkers.slice(0, 5));
              const isAdvanced = panel.categories.includes('advanced');
              
              return (
                <motion.div
                  key={panel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group cursor-pointer" onClick={() => handlePanelSelect(panel)}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                        <div className="flex gap-2 flex-wrap">
                          {panel.popular && <Badge className="bg-green-100 text-green-700 border-green-200">Popular</Badge>}
                          {isAdvanced && <Badge className="bg-purple-100 text-purple-700 border-purple-200">Advanced</Badge>}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {panel.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {panel.tagline}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">${panel.priceMin}</span>
                        {panel.priceMin !== panel.priceMax && (
                          <span className="text-lg text-gray-500">- ${panel.priceMax}</span>
                        )}
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          +$19 AI Analysis
                        </Badge>
                      </div>

                      {/* Prep Requirements */}
                      <div className="flex flex-wrap gap-1">
                        {panel.prep.toLowerCase().includes('fast') && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                            <Clock className="h-3 w-3 mr-1" />
                            Fasting
                          </Badge>
                        )}
                        {panel.prep.toLowerCase().includes('morning') && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            Morning Draw
                          </Badge>
                        )}
                        {panel.prep.toLowerCase().includes('timing') && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            Timing Required
                          </Badge>
                        )}
                      </div>

                      {/* Test Type and Authorization Badges */}
                      <div className="flex flex-wrap gap-1">
                        {panel.testType === 'kit' && (
                          <Badge variant="outline" className="text-xs">
                            <Dna className="h-3 w-3 mr-1" />
                            DNA Swab
                          </Badge>
                        )}
                        {panel.testType === 'blood' && (
                          <Badge variant="outline" className="text-xs">
                            <Droplets className="h-3 w-3 mr-1" />
                            Blood Draw
                          </Badge>
                        )}
                        {panel.testType === 'combo' && (
                          <Badge variant="outline" className="text-xs">
                            <Dna className="h-3 w-3 mr-1" />
                            DNA + Blood
                          </Badge>
                        )}
                        {panel.requiresAuthorization && (
                          <Badge variant="secondary" className="text-xs">
                            +$12.50 Authorization
                          </Badge>
                        )}
                      </div>

                      {/* State Restrictions Warning */}
                      {panel.restrictions && panel.restrictions.length > 0 && (
                        <div className="flex items-start gap-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-yellow-800">
                            {panel.restrictions.join('. ')}
                          </div>
                        </div>
                      )}

                      {/* Key Biomarkers */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Key Biomarkers ({panel.biomarkers.length} total):</div>
                        <div className="text-sm text-gray-600">
                          {keyBiomarkers.slice(0, 3).join(', ')}
                          {keyBiomarkers.length > 3 && ` +${panel.biomarkers.length - 3} more`}
                        </div>
                        
                        {panel.addOns && panel.addOns.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Add-ons: {getBiomarkersByIds(panel.addOns).slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 border-t pt-2">
                        <div><strong>Prep:</strong> {panel.prep}</div>
                        <div className="mt-1">
                          {panel.testType === 'kit' && 'Ships to you. '}
                          {(panel.testType === 'blood' || panel.testType === 'combo') && 'Quest/Labcorp draw ($10 fee). '}
                          Network clinician authorization may apply.
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleOrderPanel(panel)}
                        >
                          Order Panel + AI Analysis (${AI_INTERPRETATION_FEE})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {/* Categories Grid */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card key={category.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="text-center">
                      <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:text-blue-700 transition-colors" />
                      <div className="font-medium text-gray-900 mb-1">{category.name}</div>
                      <div className="text-xs text-gray-600">{category.description}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Comparison */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why BiohackLabs.ai Leads the Pack
            </h3>
            <p className="text-gray-600 text-lg">
              Compare features with other lab analysis platforms
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Features</th>
                  <th className="px-6 py-4 text-center font-semibold">InsideTracker</th>
                  <th className="px-6 py-4 text-center font-semibold">Jason Health</th>
                  <th className="px-6 py-4 text-center font-semibold">Docus AI</th>
                  <th className="px-6 py-4 text-center font-semibold bg-blue-800">BiohackLabs.ai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">AI Interpretation</td>
                  <td className="px-6 py-4 text-center text-gray-600">$199-$599</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-gray-600">$40-$99</td>
                  <td className="px-6 py-4 text-center bg-blue-50 font-semibold text-blue-700">$19</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Supplement Integration</td>
                  <td className="px-6 py-4 text-center text-orange-600">Limited</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-6 w-6 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">13,000+ Premium Supplements</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-6 w-6 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Advanced Biohacking / Functional Medicine AI</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-red-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><CheckCircle className="h-6 w-6 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
              Get Started with BiohackLabs.ai
            </Button>
            <p className="text-gray-500 mt-2 text-sm">25% off supplements + $19 AI analysis</p>
          </div>
        </div>
      </section>

      {/* AI Analysis Upsell */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Every Test Includes Optional AI Analysis
          </h3>
          <p className="text-gray-600 mb-6">
            Add $19 AI-powered interpretation built on functional medicine and biohacking ranges 
            to translate your results into actionable supplement and lifestyle recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Learn About AI Analysis
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Browse Supplement Store
            </Button>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <ParticipantDetailsDialog
        open={participantDialogOpen}
        onOpenChange={setParticipantDialogOpen}
        onNext={handleParticipantNext}
      />
      
      <ReceivingAddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        onBack={handleAddressBack}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default LabMarketplace;