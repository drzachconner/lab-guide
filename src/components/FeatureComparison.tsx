import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, ArrowRight } from "lucide-react";
import { getFeatureAccess } from "@/utils/supplementLinks";

interface FeatureComparisonProps {
  clinicContext?: any;
  onGetStarted: () => void;
}

const FeatureComparison = ({ clinicContext, onGetStarted }: FeatureComparisonProps) => {
  const features = getFeatureAccess(clinicContext);
  
  const comparisonData = [
    {
      feature: "Basic Lab Analysis",
      public: true,
      clinic: true,
      description: "AI-powered interpretation of common biomarkers"
    },
    {
      feature: "Functional Medicine Ranges",
      public: true,
      clinic: true,
      description: "Optimal health ranges vs. lab normals"
    },
    {
      feature: "Supplement Recommendations",
      public: "Basic suggestions",
      clinic: "Professional protocols",
      description: "Personalized supplement strategies"
    },
    {
      feature: "Advanced Biomarkers",
      public: false,
      clinic: true,
      description: "Deep analysis of specialized tests"
    },
    {
      feature: "Practitioner-Grade Supplements",
      public: false,
      clinic: true,
      description: "Access to professional supplement lines"
    },
    {
      feature: "Detailed Dosage Protocols",
      public: false,
      clinic: true,
      description: "Precise timing and dosage recommendations"
    },
    {
      feature: "Progress Tracking & Retesting",
      public: "Limited",
      clinic: "Full tracking",
      description: "Monitor your optimization journey"
    },
    {
      feature: "Practitioner Support",
      public: false,
      clinic: true,
      description: "Access to healthcare provider guidance"
    }
  ];

  if (clinicContext) {
    // Don't show comparison on clinic portals, they get full features
    return null;
  }

  return (
    <section className="py-24 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="px-4 py-2 mb-4">
            Choose Your Path
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold">
            Direct Access vs. Clinic Portal
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started immediately with basic analysis, or access the full platform 
            through your healthcare provider for comprehensive protocols.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Public Platform */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">Direct Access</CardTitle>
                  <CardDescription className="text-base">
                    Start analyzing your labs immediately
                  </CardDescription>
                </div>
                <Badge variant="outline">$29/report</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.public === true ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : item.public === false ? (
                      <X className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.feature}</div>
                    <div className="text-sm text-muted-foreground">
                      {typeof item.public === 'string' ? item.public : item.description}
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                className="w-full mt-6 btn-medical group" 
                onClick={onGetStarted}
              >
                Start Analysis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Clinic Portal */}
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
            </div>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">Clinic Portal</CardTitle>
                  <CardDescription className="text-base">
                    Full platform access through your provider
                  </CardDescription>
                </div>
                <Badge variant="secondary">Included</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {comparisonData.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.clinic === true ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.feature}</div>
                    <div className="text-sm text-muted-foreground">
                      {typeof item.clinic === 'string' ? item.clinic : item.description}
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-6 transition-medical hover:shadow-card"
              >
                Find A Provider
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 p-6 bg-muted/30 rounded-lg max-w-3xl mx-auto">
          <h3 className="font-semibold mb-2">Healthcare Providers</h3>
          <p className="text-muted-foreground">
            Offer your patients comprehensive lab analysis with your branding and supplement commissions. 
            Plans start at $149/month with full white-label features.
          </p>
          <Button variant="link" className="mt-2">
            Learn About Clinic Plans →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureComparison;