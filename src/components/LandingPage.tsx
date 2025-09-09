import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-medical-lab.jpg";
import FeatureComparison from "./FeatureComparison";
import SavingsCallout from "./SavingsCallout";

interface Clinic {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  website_url?: string;
  fullscripts_dispensary_url?: string;
  subscription_status: string;
}

interface LandingPageProps {
  clinicContext?: Clinic;
}

const LandingPage = ({ clinicContext }: LandingPageProps = {}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-clinical">
      {/* Navigation */}
      <nav className="relative z-10 bg-background/80 backdrop-blur-sm border-b border-border/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">
              {clinicContext ? clinicContext.name : "LabPilot"}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn-medical"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleSignIn}
                  className="transition-medical hover:shadow-card"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/5" />
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2">
                  AI-Powered Lab Analysis
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {clinicContext ? (
                    <>
                      Get Professional Lab Analysis for 
                      <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        {" "}Just $29
                      </span>
                    </>
                  ) : (
                    <>
                      Transform Your Lab Results into 
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {" "}Actionable Health Insights
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {clinicContext ? (
                    `${clinicContext.name} offers you comprehensive AI-powered lab analysis with professional protocols - at a fraction of the direct cost.`
                  ) : (
                    "LabPilot uses advanced AI to interpret your lab results through a functional medicine lens. Get immediate access or save 67% through your healthcare provider."
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-medical group" onClick={handleGetStarted}>
                  {user ? 'Go to Dashboard' : (
                    clinicContext ? 'Start Your $29 Analysis' : 'Start Analysis - $89'
                  )}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                {!clinicContext && (
                  <Button variant="outline" size="lg" className="transition-medical hover:shadow-card border-green-200 text-green-700 hover:bg-green-50">
                    💡 Save $60 - Find Clinic Partner
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Labs Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">98%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Analysis</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Advanced medical laboratory with AI analysis"
                className="relative w-full h-auto rounded-3xl shadow-medical"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              {clinicContext ? 'Your Complete Lab Analysis Platform' : 'Advanced Functional Medicine Analysis'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {clinicContext 
                ? 'Access the full suite of professional-grade analysis tools and protocols'
                : 'Go beyond reference ranges with AI-powered functional interpretation and personalized optimization strategies.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-medical">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Functional Ranges</CardTitle>
                <CardDescription>
                  Optimal health ranges based on functional medicine principles, not just laboratory normals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Personalized target ranges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Root cause analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Advanced biomarker tracking' : 'Basic trend monitoring'}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <Zap className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>AI Interpretation</CardTitle>
                <CardDescription>
                  Advanced machine learning analyzes patterns and correlations across all biomarkers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Pattern recognition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Correlation analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Clinical risk stratification' : 'Basic risk assessment'}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Personalized Plans</CardTitle>
                <CardDescription>
                  Customized supplement protocols and lifestyle interventions based on your unique profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Professional phased protocols' : 'Basic protocol suggestions'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Professional-grade supplements' : 'Basic supplement suggestions'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Comprehensive progress tracking' : 'Basic progress tracking'}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Savings Callout - Only show on public site */}
      <SavingsCallout clinicContext={clinicContext} />

      {/* Feature Comparison - Only show on public site */}
      <FeatureComparison 
        clinicContext={clinicContext} 
        onGetStarted={handleGetStarted}
      />

      {/* Trust Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Clinical Grade Security & Privacy</h3>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              HIPAA-compliant platform with end-to-end encryption. Your health data is protected with 
              enterprise-grade security standards used by leading healthcare institutions.
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <Badge variant="outline" className="px-4 py-2">HIPAA Compliant</Badge>
              <Badge variant="outline" className="px-4 py-2">SOC 2 Certified</Badge>
              <Badge variant="outline" className="px-4 py-2">256-bit Encryption</Badge>
              <Badge variant="outline" className="px-4 py-2">FDA Guidelines</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Optimize Your Health?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of biohackers and health optimizers who trust LabPilot 
            for actionable lab insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="btn-success group" onClick={handleGetStarted}>
              {clinicContext ? 'Access Your Portal' : 'Start Your Analysis'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            {!clinicContext && (
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                View Pricing
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;