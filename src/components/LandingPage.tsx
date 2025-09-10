import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import heroImage from "@/assets/hero-health-analysis.jpg";
import heroBiohackImage from "@/assets/hero-biohack-lab.jpg";
import AnimatedBackground from "./AnimatedBackground";

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
  const heroRef = useRef<HTMLElement>(null);

  // Smooth scroll effect - much more subtle
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach((element) => {
        // Much gentler parallax effect
        (element as HTMLElement).style.transform = `translateY(${scrolled * 0.1}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Subtle Animated Background */}
      <AnimatedBackground />
      
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Reduced to just a few subtle elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-secondary/10 rounded-2xl animate-float opacity-20" />
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-secondary/5 rounded-full animate-pulse opacity-30" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-secondary/8 rounded-lg animate-float opacity-25" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation - Cleaner */}
      <nav className="relative z-20 bg-background/5 backdrop-blur-xl border-b border-border/10">
        <div className="container mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-foreground tracking-tight">
              {clinicContext ? clinicContext.name : "BiohackLabs.ai"}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn-accent shadow-card hover:shadow-glow transition-all duration-300"
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

      {/* Hero Section - With Background Image */}
      <section 
        ref={heroRef} 
        className="relative py-32 lg:py-40 min-h-[90vh] flex items-center"
        style={{
          backgroundImage: `url(${heroBiohackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
        
        <div className="container relative mx-auto px-8 z-10">
          <div className="text-center space-y-10 max-w-6xl mx-auto">
            {/* Clean headline */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-7xl font-bold leading-tight tracking-tight">
                <div className="mb-4 drop-shadow-lg">
                  Biohack Your Lab Interpretation
                </div>
                <div className="bg-gradient-to-r from-secondary via-secondary-hover to-secondary-dark bg-clip-text text-transparent text-3xl lg:text-5xl drop-shadow-sm">
                  with Functional Levels
                </div>
              </h1>
              
              <div className="text-xl lg:text-3xl font-medium text-foreground/90 leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
                AI trained on the bleeding edge of biohacking research and Functional Medicine analysis
              </div>
            </div>

            {/* Enhanced pricing callout with better visibility */}
            <div className="bg-gradient-accent text-secondary-foreground px-8 py-5 rounded-2xl shadow-glow mx-auto max-w-lg border border-secondary/30 hover:shadow-orbital transition-all duration-300 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">Only $19</div>
              <div className="text-base font-medium opacity-90">
                Multiple Labs + Lifelong 25% Fullscript Discount
              </div>
            </div>

            <div className="space-y-8">
              <Badge 
                variant="secondary" 
                className="px-6 py-3 text-base font-medium bg-card/30 text-secondary border-secondary/40 backdrop-blur-md"
              >
                No Subscription • Multiple Labs Per Session • Biohacking Protocols
              </Badge>
              
              <p className="text-lg lg:text-xl text-foreground/85 leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
                {clinicContext ? (
                  `Transform your health with ${clinicContext.name}'s functional medicine approach—unlimited lab interpretation, targeted supplement protocols, and lifelong 25% Fullscript discount for ongoing optimization.`
                ) : (
                  "Beyond basic lab interpretation. Comprehensive functional analysis of multiple labs per session, personalized supplement protocols with lifelong 25% Fullscript discount, plus automated retest reminders and lab ordering guidance."
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Button 
                size="lg" 
                className="btn-accent text-lg px-10 py-5 h-auto shadow-glow hover:shadow-orbital transition-all duration-300 group backdrop-blur-sm" 
                onClick={handleGetStarted}
              >
                {user ? 'Access Dashboard' : 'Get Lab Analysis'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean and Smooth */}
      <section className="py-32 relative">
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            
            {/* Comprehensive Analysis - Cleaner Card */}
            <Card className="card-glass p-8 hover:shadow-glow transition-all duration-500 group border-secondary/10">
              <CardContent className="p-0 space-y-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-geometric flex items-center justify-center shadow-card">
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
            <Card className="card-glass p-8 hover:shadow-glow transition-all duration-500 group border-secondary/10">
              <CardContent className="p-0 space-y-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-geometric flex items-center justify-center shadow-card">
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
            <Card className="card-glass p-8 hover:shadow-glow transition-all duration-500 group border-secondary/10">
              <CardContent className="p-0 space-y-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-geometric flex items-center justify-center shadow-card">
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

      {/* Trust Section - Clean and Simple */}
      <section className="py-28 bg-card/5 backdrop-blur-sm border-y border-border/10">        
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center space-y-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground">Clinical Grade Security & Privacy</h3>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              HIPAA-compliant platform with end-to-end encryption. Your health data is protected with 
              enterprise-grade security standards used by leading healthcare institutions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <Badge variant="outline" className="px-4 py-3 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30 text-foreground backdrop-blur-sm hover:shadow-card transition-all duration-300 hover:scale-105">
                <Shield className="w-4 h-4 mr-2 text-secondary" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-3 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30 text-foreground backdrop-blur-sm hover:shadow-card transition-all duration-300 hover:scale-105">
                <CheckCircle className="w-4 h-4 mr-2 text-secondary" />
                SOC 2 Certified
              </Badge>
              <Badge variant="outline" className="px-4 py-3 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30 text-foreground backdrop-blur-sm hover:shadow-card transition-all duration-300 hover:scale-105">
                <Zap className="w-4 h-4 mr-2 text-secondary" />
                256-bit Encryption
              </Badge>
              <Badge variant="outline" className="px-4 py-3 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30 text-foreground backdrop-blur-sm hover:shadow-card transition-all duration-300 hover:scale-105">
                <TrendingUp className="w-4 h-4 mr-2 text-secondary" />
                FDA Guidelines
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean and Powerful */}
      <section className="py-32 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-orbital opacity-20" />
        
        <div className="container mx-auto px-8 text-center space-y-10 relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            Stop Overpaying for Lab Analysis.<br />
            <span className="text-secondary">Start Optimizing for Life.</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            One $19 session = unlimited labs analyzed + personalized protocols + lifelong 25% discount on professional supplements. 
            Why pay $50-300+ per lab when you can optimize everything at once?
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Button 
              size="lg" 
              className="btn-accent text-lg px-10 py-5 h-auto group shadow-card hover:shadow-glow transition-all duration-300" 
              onClick={handleGetStarted}
            >
              {clinicContext ? 'Access Your Portal' : 'Start Analysis Now'}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
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