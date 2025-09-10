import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-health-analysis.jpg";

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
                {/* Prominent pricing callout */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl text-center shadow-lg mb-6">
                  <div className="text-4xl font-bold mb-2">
                    {clinicContext ? "Only $19" : "Starting at $19"}
                  </div>
                  <div className="text-lg opacity-95">
                    {clinicContext 
                      ? "Premium Lab Analysis + 25% Supplement Discounts"
                      : "Premium Lab Analysis + Up to 25% Off Supplements"
                    }
                  </div>
                </div>
                <Badge variant="secondary" className="px-4 py-2">
                  Next-Gen Functional Analysis
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {clinicContext ? (
                    <>
                      Bleeding-Edge Lab Interpretation for 
                      <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                        {" "}Just $19
                      </span>
                    </>
                  ) : (
                    <>
                      Your Labs, Decoded with 
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {" "}Biohacker-Level Precision
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {clinicContext ? (
                    `${clinicContext.name} offers premium functional analysis rooted in cutting-edge biohacking research, plus lifetime access to up to 25% off practitioner-grade supplements.`
                  ) : (
                    "Next-gen functional analysis meets holistic wellness. Get bleeding-edge interpretation beyond standard AI + lifetime access to up to 25% off practitioner-grade supplements."
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-medical group" onClick={handleGetStarted}>
                  {user ? 'Go to Dashboard' : (
                    clinicContext ? 'Start $19 Analysis + Get 25% Supplement Access' : 'Start Analysis + Get 25% Supplement Access'
                  )}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                alt="Modern health analysis platform showing personalized lab results"
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
              {clinicContext ? 'Premium Biohacking-Level Analysis' : 'Next-Gen Functional Analysis'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {clinicContext 
                ? 'Cutting-edge interpretation combining functional medicine, biohacking research, and holistic wellness protocols'
                : 'Beyond standard AI interpretation. Bleeding-edge functional analysis rooted in the latest biohacking and holistic wellness research.'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-medical">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Biohacker-Level Ranges</CardTitle>
                <CardDescription>
                  Cutting-edge optimal ranges based on latest biohacking research and functional medicine principles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Bleeding-edge target ranges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Deep root cause analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Advanced biomarker correlations' : 'Pattern recognition'}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <Zap className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Premium Interpretation</CardTitle>
                <CardDescription>
                  Next-gen analysis combining cutting-edge research, biohacking protocols, and holistic wellness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Latest research integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">Biohacking protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Holistic wellness integration' : 'Comprehensive analysis'}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-medical">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Premium Supplement Access</CardTitle>
                <CardDescription>
                  Up to 25% off practitioner-grade supplements for life, plus comprehensive protocols.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Up to 25% off premium supplements' : 'Up to 25% supplement discounts'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Professional-grade formulations' : 'Premium supplement access'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">
                      {clinicContext ? 'Comprehensive lifestyle protocols' : 'Holistic wellness plans'}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


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
            Join thousands of biohackers and wellness enthusiasts who trust LabPilot 
            for premium functional analysis and exclusive supplement access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="btn-success group" onClick={handleGetStarted}>
              {clinicContext ? 'Access Your Portal' : 'Start Your Analysis'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Subtle Footer for Healthcare Providers */}
      {!clinicContext && (
        <footer className="py-8 bg-muted/30 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Healthcare Provider? 
                <a 
                  href="/clinic" 
                  className="ml-1 text-primary hover:underline transition-colors"
                >
                  Learn about LabPilot for Clinics
                </a>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LandingPage;