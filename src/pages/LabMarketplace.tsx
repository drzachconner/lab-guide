import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, TrendingUp, Shield, Brain, Heart, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface LabPanel {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  featured?: boolean;
  popular?: boolean;
  category: string;
  biomarkers: string[];
  sampleType: string;
  turnaroundTime: string;
  icon: React.ComponentType<{ className?: string }>;
}

const topBiohackerPanels: LabPanel[] = [
  {
    id: "biomarker-optimization",
    name: "Full Biomarker Optimization Panel",
    description: "Complete metabolic, hormonal, and inflammatory assessment for peak performance optimization",
    price: 299,
    originalPrice: 450,
    featured: true,
    popular: true,
    category: "Complete Panels",
    biomarkers: ["CBC", "CMP", "Lipids", "HbA1c", "Vitamin D", "Homocysteine", "hs-CRP", "TSH", "Free T3/T4", "Testosterone", "DHEA-S", "Estradiol", "Cortisol", "Insulin"],
    sampleType: "Blood",
    turnaroundTime: "3-5 days",
    icon: TrendingUp
  },
  {
    id: "methylation-longevity",
    name: "Methylation & Longevity Panel",
    description: "Essential markers for cellular health, DNA repair, and longevity optimization",
    price: 179,
    originalPrice: 275,
    featured: true,
    category: "Longevity",
    biomarkers: ["Homocysteine", "B12", "Folate", "Omega-3 Index", "Vitamin D", "NAD+"],
    sampleType: "Blood",
    turnaroundTime: "5-7 days",
    icon: Brain
  },
  {
    id: "inflammation-immune",
    name: "Inflammation & Immune Panel",
    description: "Comprehensive inflammatory and immune system assessment for optimal resilience",
    price: 149,
    originalPrice: 230,
    category: "Immune Health",
    biomarkers: ["hs-CRP", "Ferritin", "ESR", "ANA", "IgG", "IgA", "IgM", "White Blood Cell Differential"],
    sampleType: "Blood",
    turnaroundTime: "3-5 days",
    icon: Shield
  },
  {
    id: "hormone-optimization",
    name: "Advanced Hormone Optimization",
    description: "Complete hormonal profile for energy, recovery, and performance enhancement",
    price: 199,
    originalPrice: 320,
    popular: true,
    category: "Hormones",
    biomarkers: ["Total Testosterone", "Free Testosterone", "Estradiol", "Progesterone", "DHEA-S", "Cortisol AM/PM", "SHBG", "IGF-1"],
    sampleType: "Blood + Saliva",
    turnaroundTime: "5-7 days",
    icon: Zap
  },
  {
    id: "metabolic-performance",
    name: "Metabolic Performance Panel", 
    description: "Optimize energy production, fat burning, and metabolic efficiency",
    price: 169,
    originalPrice: 260,
    category: "Metabolism",
    biomarkers: ["Insulin", "Glucose", "HbA1c", "Thyroid Panel", "Leptin", "Adiponectin", "Lactate"],
    sampleType: "Blood",
    turnaroundTime: "3-5 days",
    icon: Heart
  },
  {
    id: "gut-microbiome",
    name: "Gut & Microbiome Health",
    description: "Comprehensive digestive and microbiome analysis for optimal gut health",
    price: 249,
    originalPrice: 380,
    category: "Gut Health",
    biomarkers: ["Comprehensive Stool Analysis", "SIBO Breath Test", "Zonulin", "Calprotectin", "Microbiome Diversity"],
    sampleType: "Stool + Breath",
    turnaroundTime: "7-10 days",
    icon: Users
  }
];

const LabMarketplace = () => {
  const navigate = useNavigate();

  const handlePanelSelect = (panel: LabPanel) => {
    // For now, redirect to auth with panel info
    navigate(`/auth?type=order-labs&panel=${panel.id}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

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
              Professional-Grade Lab Testing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Order Labs. <span className="text-blue-600">Unlock Your Biology.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Curated lab panels from leading functional medicine practitioners and performance experts. 
              Get actionable insights with AI analysis + practitioner-grade supplements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Panels */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Biohacker Panels</h2>
            <p className="text-gray-600">Panels optimized for biohackers, longevity seekers, and peak performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topBiohackerPanels.map((panel, index) => {
                  const IconComponent = panel.icon;
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
                            <div className="flex gap-2">
                              {panel.featured && <Badge className="bg-amber-100 text-amber-700 border-amber-200">Featured</Badge>}
                              {panel.popular && <Badge className="bg-green-100 text-green-700 border-green-200">Popular</Badge>}
                            </div>
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {panel.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {panel.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">${panel.price}</span>
                            {panel.originalPrice && (
                              <span className="text-lg text-gray-500 line-through">${panel.originalPrice}</span>
                            )}
                            {panel.originalPrice && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Save ${panel.originalPrice - panel.price}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div><strong>Sample:</strong> {panel.sampleType}</div>
                            <div><strong>Results:</strong> {panel.turnaroundTime}</div>
                            <div><strong>Biomarkers:</strong> {panel.biomarkers.length} included</div>
                          </div>

                          <div className="pt-2">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Order Now + Get AI Analysis
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
            })}
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
    </div>
  );
};

export default LabMarketplace;