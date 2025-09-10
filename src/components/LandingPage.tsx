import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Upload, Brain, ShoppingCart, Star, TrendingUp, Users, Shield, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import HeroBackground from "./HeroBackground";

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
            <span className="text-gray-500">Biohack</span><span className="text-blue-600">Labs</span><span className="text-gray-500">.ai</span>
          </div>
          
          {!user && (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="text-gray-600">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-2 pb-8 px-4 relative">
        <HeroBackground />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              AI-Powered Lab Analysis + Supplement Connection
            </Badge>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Biohack with Precision
              <br />
              <span className="text-blue-600">Functional Lab Analysis</span>
              <br />
              <span className="text-blue-600">+</span>
              <br />
              <span className="text-blue-600">Tailored Supplements</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your lab work and get AI-powered analysis that connects you directly to the specific supplements you need—with exact dosing at just above wholesale pricing. The cheapest possible prices on 13,000+ professional-grade products.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg"
              >
                Start Lab Analysis - $19
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-6 text-lg rounded-lg border-gray-300"
              >
                See How It Works
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-start md:justify-center gap-8 text-base text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                One-time payment
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                Multiple labs per session
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
                Just above wholesale pricing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The only platform that bridges lab analysis with supplement ordering <span className="text-blue-600">at just above wholesale pricing</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Other AI tools give you generic advice. Other supplement platforms make you search thousands of products. We do both—analyzing your specific lab work and connecting you directly to the exact supplements at just above wholesale pricing—the cheapest possible prices online.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Specialized AI Analysis</h3>
                    <p className="text-gray-600">Trained on biohacking and functional medicine protocols, not generic health advice</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Direct Supplement Connection</h3>
                    <p className="text-gray-600">Every recommendation links to specific products with exact dosing and timing</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Just Above Wholesale Pricing</h3>
                    <p className="text-gray-600">Cheapest possible prices on 13,000+ supplements—direct from manufacturers</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">$19</div>
                <div className="text-lg font-medium text-gray-900 mb-6">Complete Lab Analysis</div>
                
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <div className="text-sm font-medium text-blue-900 mb-2">INCLUDED</div>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✓ Multiple lab upload & analysis</li>
                    <li>✓ Personalized supplement protocols</li>
                    <li>✓ Exact dosing & timing instructions</li>
                    <li>✓ Just above wholesale pricing access</li>
                    <li>✓ Direct product links & ordering</li>
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  size="lg"
                  onClick={handleGetStarted}
                >
                  Get Started Now
                </Button>
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
              From lab results to supplements in minutes
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and scientifically-backed recommendations
            </p>
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
                  Securely upload any number of recent lab reports. Works with all major providers—Quest, LabCorp, or your local clinic.
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
                  Our specialized AI analyzes your results using cutting-edge biohacking and functional medicine protocols.
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
                  Receive personalized protocols with direct links to specific supplements at just above wholesale pricing—delivered to your door.
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
            Trusted by health optimizers worldwide
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Finally found a platform that actually connects my lab work to specific supplements. No more guessing what to buy."
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
                "The wholesale pricing pays for itself immediately. Plus the AI actually understands functional medicine."
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
                "Saved me hours of research and hundreds on supplements. The exact dosing recommendations are game-changing."
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
              <div className="text-gray-600">Above Wholesale</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600">Labs Analyzed</div>
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
            Get the exact supplements your lab work recommends at just above wholesale pricing—the cheapest possible prices online.
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
            One payment • Wholesale pricing access • No subscription required
          </p>
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
              Professional lab analysis meets premium supplement access.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;