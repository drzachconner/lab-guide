import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap, LogIn, Star, Heart, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-background">
      {/* Clean Navigation - Jeton Style */}
      <nav className="bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-foreground">
              {clinicContext ? clinicContext.name : "BiohackLabs.ai"}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn-primary"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={handleSignIn}
                  className="btn-ghost"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Bold Jeton Style with Gradient Background */}
      <section className="gradient-hero py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Large, Bold Headlines - Jeton Style */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Beyond Generic AI
                <br />
                Lab Analysis.
              </h1>
              <div className="text-3xl lg:text-5xl font-bold text-white/90">
                Get Cutting-Edge Biohacker Insights
              </div>
              <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto">
                Elite biohacking & functional medicine methodologies for comprehensive lab analysis
              </p>
            </div>

            {/* Clean Pricing Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto shadow-xl border border-white/20">
              <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                $19
              </div>
              <div className="text-xl font-semibold text-foreground mb-4">
                Complete Lab Analysis Session
              </div>
              <div className="bg-gradient-subtle rounded-2xl p-4">
                <div className="text-sm font-medium text-secondary-dark mb-1">BONUS INCLUDED</div>
                <div className="text-base font-semibold text-foreground">
                  Lifelong 25% Discount on 13,000+ Quality Supplements
                </div>
              </div>
            </div>

            {/* Key Benefits Badge */}
            <Badge className="px-8 py-3 text-base font-medium bg-white/20 text-white border-white/30 rounded-2xl">
              No Subscription • Multiple Labs Per Session • Biohacking Protocols
            </Badge>

            {/* Description */}
            <p className="text-lg lg:text-xl text-white/85 leading-relaxed max-w-4xl mx-auto">
              {clinicContext ? (
                `Transform your health with ${clinicContext.name}'s functional medicine approach—unlimited lab interpretation, targeted supplement protocols, and lifelong 25% Fullscript discount for ongoing optimization.`
              ) : (
                "Beyond basic lab interpretation. Comprehensive functional analysis of multiple labs per session, personalized supplement protocols with lifelong 25% Fullscript discount, plus automated retest reminders and lab ordering guidance."
              )}
            </p>
            
            {/* Main CTA */}
            <div className="pt-6">
              <Button 
                size="lg" 
                className="btn-secondary text-xl px-12 py-6 h-auto group" 
                onClick={handleGetStarted}
              >
                {user ? 'Access Dashboard' : 'Get Lab Analysis'}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Cards */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                All your lab insights,
                <br />
                <span className="text-primary">in one analysis.</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join 1M+ happy users today.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Comprehensive Analysis */}
              <Card className="card-feature group">
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Comprehensive Analysis
                    </CardTitle>
                  </CardHeader>
                  <p className="text-muted-foreground leading-relaxed">
                    Upload multiple lab reports in one $19 session and get insights that generic AI tools miss. Our specialized training in cutting-edge biohacking research, functional medicine protocols, and advanced pattern recognition uncovers hidden correlations in your data—complete with visual breakdowns and actionable protocols tailored to optimization, not just "normal" ranges.
                  </p>
                </CardContent>
              </Card>

              {/* Lifelong Supplement Access */}
              <Card className="card-feature group">
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-accent flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-secondary transition-colors">
                      Lifelong Supplement Access
                    </CardTitle>
                  </CardHeader>
                  <p className="text-muted-foreground leading-relaxed">
                    Get lifelong 25% off professional-grade Fullscript supplements tailored to your lab results. Automated retest reminders and suggested follow-up labs keep you optimizing long-term.
                  </p>
                </CardContent>
              </Card>

              {/* Optimization-Focused */}
              <Card className="card-feature group">
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      Optimization-Focused
                    </CardTitle>
                  </CardHeader>
                  <p className="text-muted-foreground leading-relaxed">
                    Beyond basic "disease detection"—get biohacking protocols for energy, cognition, longevity. We guide you to affordable lab providers like Jason Health so you focus on optimization, not ordering.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps - Jeton Style */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Simple, fast & safe
            </h2>
            <p className="text-xl text-muted-foreground mb-16">
              Get your comprehensive analysis in 5 simple steps
            </p>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                { number: "01", title: "Upload", icon: TrendingUp },
                { number: "02", title: "Analyze", icon: Brain },
                { number: "03", title: "Review", icon: CheckCircle },
                { number: "04", title: "Optimize", icon: Zap },
                { number: "05", title: "Thrive", icon: Heart }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-subtle flex items-center justify-center border border-border">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">{step.number}</div>
                  <div className="text-lg font-semibold text-foreground">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 lg:py-32 bg-gradient-subtle">        
        <div className="container mx-auto px-6">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-foreground">Clinical Grade Security & Privacy</h3>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              HIPAA-compliant platform with end-to-end encryption. Your health data is protected with 
              enterprise-grade security standards used by leading healthcare institutions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, label: "HIPAA Compliant" },
                { icon: CheckCircle, label: "SOC 2 Certified" },
                { icon: Zap, label: "256-bit Encryption" },
                { icon: TrendingUp, label: "FDA Guidelines" }
              ].map((item, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-smooth border border-border">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold text-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="gradient-hero py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Stop Guessing.<br />
              <span className="text-white/80">Start Biohacking with Precision.</span>
            </h2>
            <p className="text-xl text-white/85 leading-relaxed">
              One $19 session unlocks comprehensive analysis using elite biohacking and functional medicine methodologies + personalized protocols + lifelong 25% discount on 13,000+ quality supplement and wellness products.
            </p>
            <div className="pt-6">
              <Button 
                size="lg" 
                className="btn-secondary text-xl px-12 py-6 h-auto group" 
                onClick={handleGetStarted}
              >
                {clinicContext ? 'Access Your Portal' : 'Start Analysis Now'}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer for Healthcare Providers */}
      {!clinicContext && (
        <footer className="py-12 bg-muted/50 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="text-center text-muted-foreground">
                <p className="text-lg">
                  Healthcare Provider? 
                  <a 
                    href="/clinic" 
                    className="ml-2 text-primary hover:text-primary-hover transition-colors font-medium"
                  >
                    Learn about BiohackLabs.ai for Clinics
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