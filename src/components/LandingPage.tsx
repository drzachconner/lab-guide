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
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="relative z-10 bg-background/20 backdrop-blur-md border-b border-border/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-foreground">
              {clinicContext ? clinicContext.name : "BiohackLabs.ai"}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn-accent"
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
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/10" />
        <div className="container relative mx-auto px-6">
          <div className="text-center space-y-12 max-w-5xl mx-auto">
            {/* Main headline first */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-center">
                <div className="mb-4">Biohack Your Lab Interpretation</div>
                <div className="bg-gradient-to-r from-secondary via-secondary-hover to-secondary-dark bg-clip-text text-transparent">
                  with Functional Levels
                </div>
              </h1>
              
              <div className="text-2xl lg:text-3xl font-semibold text-muted-foreground/90 leading-relaxed">
                Optimize Your Biology with Advanced Functional Lab Interpretations
              </div>
            </div>

            {/* Pricing callout */}
            <div className="bg-gradient-accent text-secondary-foreground px-8 py-4 rounded-full text-center shadow-glow mx-auto max-w-md">
              <div className="text-3xl font-bold mb-1">
                Only $19
              </div>
              <div className="text-sm font-medium opacity-90">
                Multiple Labs Per Interpretation + Lifelong 25% Fullscript Discount
              </div>
            </div>

            <div className="space-y-8">
              <Badge variant="secondary" className="px-6 py-3 text-sm font-medium bg-secondary/10 text-secondary border-secondary/20">
                No Subscription • Multiple Labs Per Session • Biohacking Protocols
              </Badge>
              
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                {clinicContext ? (
                  `Transform your health with ${clinicContext.name}'s functional medicine approach—unlimited lab interpretation, targeted supplement protocols, and lifelong 25% Fullscript discount for ongoing optimization.`
                ) : (
                  "Beyond basic lab interpretation. Get comprehensive functional analysis of multiple labs per session, personalized supplement protocols with lifelong 25% Fullscript discount, plus automated retest reminders and lab ordering guidance through partners like Jason Health."
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="btn-accent text-lg px-8 py-4 h-auto" onClick={handleGetStarted}>
                {user ? 'Access Dashboard' : 'Inquire About Access'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Multiple Labs Per Session */}
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Comprehensive Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload multiple lab reports in one $19 session and get insights that generic AI tools miss. Our specialized training in cutting-edge biohacking research, functional medicine protocols, and advanced pattern recognition uncovers hidden correlations in your data—complete with visual breakdowns and actionable protocols tailored to optimization, not just "normal" ranges.
              </p>
            </div>

            {/* Premium Supplements */}
            <div className="text-center space-y-6 lg:border-x border-border/20 lg:px-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Lifelong Supplement Access</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get lifelong 25% off professional-grade Fullscript supplements tailored to your lab results. Automated retest reminders and suggested follow-up labs keep you optimizing long-term.
              </p>
            </div>

            {/* Biohacker-Focused */}
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Optimization-Focused</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beyond basic "disease detection"—get biohacking protocols for energy, cognition, longevity. We guide you to affordable lab providers like Jason Health so you focus on optimization, not ordering.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Trust Section */}
      <section className="py-24 bg-card/20 backdrop-blur-sm border-y border-border/20">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">Clinical Grade Security & Privacy</h3>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              HIPAA-compliant platform with end-to-end encryption. Your health data is protected with 
              enterprise-grade security standards used by leading healthcare institutions.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <Badge variant="outline" className="px-6 py-3 bg-card/30 border-border/30 text-foreground">HIPAA Compliant</Badge>
              <Badge variant="outline" className="px-6 py-3 bg-card/30 border-border/30 text-foreground">SOC 2 Certified</Badge>
              <Badge variant="outline" className="px-6 py-3 bg-card/30 border-border/30 text-foreground">256-bit Encryption</Badge>
              <Badge variant="outline" className="px-6 py-3 bg-card/30 border-border/30 text-foreground">FDA Guidelines</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary-light/20" />
        <div className="container mx-auto px-6 text-center space-y-8 relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Stop Paying Per Interpretation. Start Optimizing.
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Unlike competitors charging $50-300+ per lab, get comprehensive interpretation of multiple labs 
            in one session, targeted protocols, and lifelong 25% Fullscript discount for just $19.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Button size="lg" className="btn-accent text-lg px-8 py-4 h-auto group" onClick={handleGetStarted}>
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