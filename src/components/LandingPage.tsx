import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Upload, Brain, ShoppingCart, Star, TrendingUp, Users, Shield, LogIn, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import HeroBackground from "./HeroBackground";
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

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
            <span className="text-blue-600">Biohack</span><span className="text-gray-500">Labs</span><span className="text-blue-600">.ai</span>
          </div>
          
          {!user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600">
                  <User className="mr-2 h-4 w-4" />
                  Account
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg border border-gray-200 z-50">
                <DropdownMenuItem onClick={() => navigate('/auth?type=analysis')} className="cursor-pointer">
                  <Brain className="mr-2 h-4 w-4" />
                  Lab Analysis + Dispensary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/auth?type=dispensary')} className="cursor-pointer">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Shop Dispensary (30% Off)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/auth?type=signin')} className="cursor-pointer">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-600">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-4 pb-12 px-4 relative">
        <HeroBackground />
        <AnimatedBackground />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              The Most Advanced Biohacking AI — Only $19
            </Badge>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight px-2">
              <span className="text-gray-900">Labs.</span>
              <span className="text-gray-900"> Analysis.</span>
              <span className="text-gray-900"> Supplements.</span>
              <span className="text-blue-600"> Done Right</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed px-4">
              Get functional medicine analysis trained on cutting-edge protocols and optimal ranges.
              Plus, access premium supplements at up to 30% off retail.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 px-4">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-base sm:text-lg rounded-lg w-full sm:w-auto"
              >
                Start Lab Analysis – $19
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleGetStarted}
                className="px-6 py-4 text-base sm:text-lg rounded-lg border-gray-300 w-full sm:w-auto"
              >
                Get Started – Order Labs
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 px-4">
              Already have labs? Upload them for $19.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Labs. Analysis. Supplements. Done Right.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              The lowest-cost labs, the smartest AI interpretations, and the biggest discounts on premium supplements—all in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="px-2">
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Order labs with network clinician authorization</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">AI analysis of results focused on functional ranges</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Personalized supplement protocols with exact dosing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">30% off 13,000+ practitioner-grade supplements (25% in Canada)</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Hands-off, HIPAA-compliant process</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">Full Lab-to-Supplement Support</div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mb-4" 
                  size="lg"
                  onClick={handleGetStarted}
                >
                  Get Started – Order Labs
                </Button>
                
                <div className="text-sm text-gray-500 pt-2 border-t">
                  Already have labs? Upload them for $19.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">1. Upload Your Labs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Works with Quest, LabCorp, and most clinics.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">2. AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced biohacking AI trained on functional medicine protocols.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">3. Get Supplements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Personalized protocols with direct links to premium products at wholesale pricing.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Testimonials
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Finally, a platform that connects my lab work to the exact supplements I need. No more guessing."
              </p>
              <div className="font-medium text-gray-900">Sarah M.</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Wholesale pricing pays for itself immediately. The AI actually understands functional medicine."
              </p>
              <div className="font-medium text-gray-900">Dr. James K.</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Saved me hours of research and hundreds on supplements."
              </p>
              <div className="font-medium text-gray-900">Mike R.</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">13,000+</div>
              <div className="text-gray-600">Premium Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
              <div className="text-gray-600">Off Maximum Discount</div>
              <div className="text-xs text-green-600 font-medium">Cheapest Access</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600">Labs Analyzed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Clinical-Grade Privacy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">HIPAA compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">End-to-end encrypted</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Secure cloud storage</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">HIPAA Compliant</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">End-to-End Encrypted</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Secure Cloud Storage</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="font-semibold text-gray-900">Data Privacy Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Stop guessing. Start optimizing.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the exact supplements your lab work recommends with direct Fullscript dispensary access at wholesale pricing.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg rounded-lg"
          >
            Start Lab Analysis - $19
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            One payment • Fullscript dispensary access • No subscription required
          </p>
        </div>
      </section>

      {/* Dispensary Only Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-green-50">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
              Just Want Premium Supplements?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 md:mb-8 text-center px-2">
              Skip the lab analysis and get direct access to our Fullscript dispensary at 30% off retail prices.
            </p>
            
            <div className="bg-green-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <div className="text-sm font-medium text-green-900 mb-2 text-center">DISPENSARY ACCESS INCLUDES</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm text-green-800">
                <div className="flex items-center justify-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  <span>13,000+ provider-grade products</span>
                </div>
                <div className="flex items-center justify-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  <span>30% off retail prices (25% in Canada)</span>
                </div>
                <div className="flex items-center justify-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  <span>Direct from manufacturers</span>
                </div>
                <div className="flex items-center justify-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                  <span>Fast shipping & returns</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth?type=dispensary')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 md:px-12 py-4 md:py-6 text-base md:text-lg rounded-lg w-full sm:w-auto"
              >
                <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Access Dispensary - Free Signup
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                No lab analysis required • Instant access • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center text-gray-600">
            <div className="text-xl font-bold text-gray-900 mb-4">
              <span className="text-gray-500">Biohack</span><span className="text-blue-600">Labs</span><span className="text-gray-500">.ai</span>
            </div>
            <p>
              Biohacking Lab Analysis, Premium Supplements, Maximum Discounts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;