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
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-geometric rounded-full animate-float opacity-20" />
        <div className="absolute top-40 right-20 w-24 h-24 border border-secondary/20 rounded-lg animate-orbit opacity-30" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-secondary/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-10 w-6 h-6 bg-secondary/30 rounded-full animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-background/10 backdrop-blur-xl border-b border-border/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-foreground">
              {clinicContext ? clinicContext.name : "BiohackLabs.ai"}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn-accent shadow-geometric"
                >
                  Dashboard
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={handleSignIn}
                  className="btn-ghost-premium"
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
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-orbital opacity-50" />
        <div className="container relative mx-auto px-6">
          <div className="text-center space-y-10 max-w-5xl mx-auto">
            {/* Main headline */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <div className="mb-3">Biohack Your Lab Interpretation</div>
                <div className="bg-gradient-to-r from-secondary via-secondary-hover to-secondary-dark bg-clip-text text-transparent">
                  with Functional Levels
                </div>
              </h1>
              
              <div className="text-xl lg:text-2xl font-medium text-muted-foreground/90 leading-relaxed max-w-3xl mx-auto">
                Next-level optimization with advanced functional lab interpretations
              </div>
            </div>

            {/* Pricing callout - more geometric */}
            <div className="bg-gradient-accent text-secondary-foreground px-6 py-3 rounded-2xl shadow-glow mx-auto max-w-sm border border-secondary/20">
              <div className="text-2xl font-bold mb-1">Only $19</div>
              <div className="text-sm font-medium opacity-90">
                Multiple Labs + Lifelong 25% Fullscript Discount
              </div>
            </div>

            <div className="space-y-6">
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm font-medium bg-card/30 text-secondary border-secondary/30 backdrop-blur-sm"
              >
                No Subscription • Multiple Labs Per Session • Biohacking Protocols
              </Badge>
              
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                {clinicContext ? (
                  `Transform your health with ${clinicContext.name}'s functional medicine approach—unlimited lab interpretation, targeted supplement protocols, and lifelong 25% Fullscript discount for ongoing optimization.`
                ) : (
                  "Beyond basic lab interpretation. Comprehensive functional analysis of multiple labs per session, personalized supplement protocols with lifelong 25% Fullscript discount, plus automated retest reminders and lab ordering guidance."
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="btn-accent text-lg px-8 py-4 h-auto shadow-geometric hover:shadow-glow transition-all duration-300 group" 
                onClick={handleGetStarted}
              >
                {user ? 'Access Dashboard' : 'Inquire About Access'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Cleaner Geometric Cards */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Comprehensive Analysis - Enhanced Card */}
            <Card className="card-glass p-8 hover:shadow-orbital transition-all duration-500 group border-secondary/10">
              <CardContent className="p-0 space-y-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-geometric flex items-center justify-center shadow-geometric">
                  <TrendingUp className="h-7 w-7 text-secondary" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-secondary transition-colors">
                    Comprehensive Analysis
                  </CardTitle>
                </CardHeader>
                <p className="text-muted-foreground leading-relaxed">
                  Upload multiple lab reports in one $19 session and get insights that generic AI tools miss. Our specialized training in cutting-edge biohacking research, functional medicine protocols, and advanced pattern recognition uncovers hidden correlations in your data—complete with visual breakdowns and actionable protocols tailored to optimization, not just "normal" ranges.
                </p>
              </CardContent>
            </Card>

            {/* Lifelong Supplement Access */}
            <Card className="card-glass p-8 hover:shadow-orbital transition-all duration-500 group border-secondary/10">
              <CardContent className="p-0 space-y-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-geometric flex items-center justify-center shadow-geometric">
                  <Zap className="h-7 w-7 text-secondary" />
                </div>
                <CardHeader className="p-0">
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
            <Card className="card-glass p-8 hover:shadow-orbital transition-all duration-500 group border-secondary/10">
              <CardContent className="p-0 space-y-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-geometric flex items-center justify-center shadow-geometric">
                  <Users className="h-7 w-7 text-secondary" />
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-secondary transition-colors">
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
      </section>

      {/* Trust Section - More Geometric */}
      <section className="py-20 bg-card/10 backdrop-blur-xl border-y border-border/10 relative overflow-hidden">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 bg-gradient-orbital opacity-30" />
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-geometric flex items-center justify-center shadow-geometric">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Clinical Grade Security & Privacy</h3>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              HIPAA-compliant platform with end-to-end encryption. Your health data is protected with 
              enterprise-grade security standards used by leading healthcare institutions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <Badge variant="outline" className="px-4 py-3 bg-card/20 border-secondary/20 text-foreground backdrop-blur-sm hover:bg-card/30 transition-colors">
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-3 bg-card/20 border-secondary/20 text-foreground backdrop-blur-sm hover:bg-card/30 transition-colors">
                SOC 2 Certified
              </Badge>
              <Badge variant="outline" className="px-4 py-3 bg-card/20 border-secondary/20 text-foreground backdrop-blur-sm hover:bg-card/30 transition-colors">
                256-bit Encryption
              </Badge>
              <Badge variant="outline" className="px-4 py-3 bg-card/20 border-secondary/20 text-foreground backdrop-blur-sm hover:bg-card/30 transition-colors">
                FDA Guidelines
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced Spaceship Style */}
      <section className="py-28 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-orbital opacity-20" />
        <div className="absolute top-10 left-10 w-20 h-20 border border-secondary/30 rounded-2xl animate-float opacity-50" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-secondary/20 rounded-full animate-pulse" />
        
        <div className="container mx-auto px-6 text-center space-y-8 relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Stop Paying Per Interpretation. Start Optimizing.
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Unlike competitors charging $50-300+ per lab, get comprehensive interpretation of multiple labs 
            in one session, targeted protocols, and lifelong 25% Fullscript discount for just $19.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              className="btn-accent text-lg px-8 py-4 h-auto group shadow-geometric hover:shadow-orbital transition-all duration-300" 
              onClick={handleGetStarted}
            >
              {clinicContext ? 'Access Your Portal' : 'Inquire About Membership'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Subtle Footer for Healthcare Providers */}
      {!clinicContext && (
        <footer className="py-12 bg-card/10 backdrop-blur-sm border-t border-border/20">
          <div className="container mx-auto px-6">
            <div className="text-center text-muted-foreground">
                <p className="text-lg">
                  Healthcare Provider? 
                  <a 
                    href="/clinic" 
                    className="ml-2 text-secondary hover:text-secondary-hover transition-colors font-medium"
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