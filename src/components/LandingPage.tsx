import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Upload, Brain, ShoppingCart, Star, TrendingUp, Users, Shield, LogIn, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import HeroFX from "./HeroFX";
import { motion } from "framer-motion";

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

  const handleOrderLabs = () => {
    navigate('/labs');
  };

  const handleUploadLabs = () => {
    if (user) {
      navigate('/dashboard'); // TODO: Navigate to upload labs page  
    } else {
      navigate('/auth?type=upload-labs');
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
                  Shop Dispensary (25% Off)
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
      <section className="relative isolate overflow-hidden min-h-[70vh] pt-12 pb-16">
        {/* Backgrounds behind content */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HeroFX />
        </div>

        {/* Foreground content */}
        <div className="container mx-auto max-w-6xl px-4 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                The Most Advanced Biohacking AI — Only $19
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="text-gray-900">AI Functional Analysis +</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="text-blue-600">Practitioner-Direct Supplements</span>
              </motion.div>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Get functional medicine analysis trained on cutting-edge biohacking protocols and optimal functional ranges.
              Plus, access premium <strong>practitioner-grade supplements at 25% off retail (via Fullscript)</strong>.
            </motion.p>
            
            <motion.div 
              className="flex justify-center mb-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Button 
                size="lg" 
                onClick={handleOrderLabs}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-base sm:text-lg rounded-lg w-full sm:w-auto transition-all duration-200 hover:scale-105"
              >
                Get Started – Order Labs
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
            
            <motion.p 
              className="text-sm text-gray-500 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Already have labs? <button onClick={handleUploadLabs} className="text-blue-600 hover:text-blue-700 underline cursor-pointer transition-colors duration-200">Upload them for $19 flat — no hidden fees</button>.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              AI Functional Analysis + Practitioner-Direct Supplements
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              The lowest-cost labs, the smartest AI interpretations, and the biggest discounts on premium supplements—all in one place.
            </p>
            
            {/* Trust badges */}
            <div className="flex justify-center items-center gap-6 mb-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                HIPAA-Compliant
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                End-to-End Encrypted
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                Secure Cloud Storage
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="px-2">
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Order labs directly through our clinical network</span>
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
                  <span className="text-gray-700">25% off retail on 13,000+ practitioner-grade supplements</span>
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
                  onClick={handleOrderLabs}
                >
                  Get Started – Order Labs
                </Button>
                
                <div className="text-sm text-gray-500 pt-2 border-t">
                  Already have labs? <button onClick={handleUploadLabs} className="text-blue-600 hover:text-blue-700 underline cursor-pointer">Upload them for $19 flat — no hidden fees</button>.
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
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <Upload className="h-8 w-8 text-blue-600" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                </div>
                <CardTitle className="text-xl">Order or Upload Labs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Order labs directly through our clinical network or upload existing results from Quest, LabCorp, and most clinics.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <Brain className="h-8 w-8 text-green-600" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                </div>
                <CardTitle className="text-xl">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Advanced biohacking AI trained on functional medicine protocols.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                </div>
                <CardTitle className="text-xl">Get Supplements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Personalized protocols with direct links to premium products with practitioner-direct pricing (25% off).
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BiohackLabs.ai?
            </h2>
            <p className="text-xl text-gray-600">
              The only platform offering complete lab-to-supplement optimization
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Mobile scroll hint */}
            <div className="block md:hidden bg-blue-50 px-4 py-2 text-center">
              <p className="text-sm text-blue-600 font-medium">← Swipe to compare all platforms →</p>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {/* Scroll indicators for mobile */}
              <div className="block md:hidden relative">
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              </div>
              
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 md:p-6 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-20 min-w-[160px]">Features</th>
                    <th className="text-center p-4 md:p-6 font-semibold text-gray-700 min-w-[120px]">InsideTracker</th>
                    <th className="text-center p-4 md:p-6 font-semibold text-gray-700 min-w-[120px]">Jason Health</th>
                    <th className="text-center p-4 md:p-6 font-semibold text-gray-700 min-w-[120px]">Docus AI</th>
                    <th className="text-center p-4 md:p-6 font-semibold text-gray-700 min-w-[120px]">Everlywell</th>
                    <th className="text-center p-4 md:p-6 font-semibold text-white bg-blue-600 min-w-[140px]">BiohackLabs.ai</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 md:p-6 font-medium text-gray-900 sticky left-0 bg-white z-10">Lab Ordering</td>
                    <td className="text-center p-6">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">✓</div>
                    </td>
                    <td className="text-center p-6">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">✓</div>
                    </td>
                    <td className="text-center p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-6">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">✓</div>
                    </td>
                    <td className="text-center p-6 bg-blue-50">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 md:p-6 font-medium text-gray-900 sticky left-0 bg-white z-10">AI Interpretation</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">✓</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">✓</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6 bg-blue-50">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
                    </td>
                  </tr>
                  
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 md:p-6 font-medium text-gray-900 sticky left-0 bg-white z-10">Biohacking AI Analysis</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6 bg-blue-50">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
                    </td>
                  </tr>
                  
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 md:p-6 font-medium text-gray-900 sticky left-0 bg-white z-10">Functional Range Analysis</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">~</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6 bg-blue-50">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
                    </td>
                  </tr>
                  
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 md:p-6 font-medium text-gray-900 sticky left-0 bg-white z-10">Premium Supplement Access</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">~</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6 bg-blue-50">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
                    </td>
                  </tr>
                  
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 md:p-6 font-medium text-gray-900 sticky left-0 bg-white z-10">Practitioner-Direct Pricing</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">✗</div>
                    </td>
                    <td className="text-center p-4 md:p-6 bg-blue-50">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto">✓</div>
                    </td>
                  </tr>
                  
                  <tr className="bg-gray-50 font-semibold">
                    <td className="p-4 md:p-6 font-bold text-gray-900 sticky left-0 bg-gray-50 z-10">Starting Price</td>
                    <td className="text-center p-4 md:p-6 text-gray-700">$199-$599</td>
                    <td className="text-center p-4 md:p-6 text-gray-700">$39-$129</td>
                    <td className="text-center p-4 md:p-6 text-gray-700">$40-$99</td>
                    <td className="text-center p-4 md:p-6 text-gray-700">$69-$249</td>
                    <td className="text-center p-4 md:p-6 bg-blue-600 text-white font-bold">$19</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-blue-600 text-white p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Only BiohackLabs.ai Offers Everything</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-blue-100">Lab Tests</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">$19</div>
                  <div className="text-blue-100">AI Analysis</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">25%</div>
                  <div className="text-blue-100">Supplement Savings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">13K+</div>
                  <div className="text-blue-100">Premium Products</div>
                </div>
              </div>
              <p className="text-blue-100 text-lg">
                The complete biohacking solution: Lab ordering + AI interpretation + functional analysis + premium supplements at practitioner prices
              </p>
            </div>
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
                "Practitioner-direct pricing pays for itself immediately. The AI actually understands functional medicine."
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
              <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
              <div className="text-gray-600">Practitioner-Direct Savings</div>
              <div className="text-xs text-green-600 font-medium">Best Available</div>
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
            Stop guessing.<br />Start optimizing.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the exact supplements your lab work recommends with direct Fullscript dispensary access at 25% off retail.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleUploadLabs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg rounded-lg"
          >
            Upload Labs - $19
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            One payment • Fullscript dispensary access • No subscription required
          </p>
        </div>
      </section>

      {/* Lab Tests Showcase */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              500+ Premium Lab Tests Available
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access the same advanced panels used by top biohackers and functional medicine practitioners
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* 10x Health Style Panel */}
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-700">Comprehensive Biohacker Panel</CardTitle>
                <CardDescription>Advanced biomarker analysis for optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Complete Hormone Panel (Testosterone, Thyroid, Cortisol)
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Advanced Lipid & Cardiovascular Markers
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Metabolic & Insulin Function
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Inflammation & Oxidative Stress
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Functional Medicine Panel */}
            <Card className="border-2 border-green-100 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-700">Functional Medicine Essentials</CardTitle>
                <CardDescription>Root cause analysis for optimal health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Nutrient Deficiency Assessment
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Heavy Metals & Toxin Screen
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Gut Health & Microbiome
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Food Sensitivities & Allergies
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance & Longevity Panel */}
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-purple-700">Performance & Longevity</CardTitle>
                <CardDescription>Elite athlete & longevity optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    VO2 Max & Athletic Performance Markers
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Biological Age Assessment
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Recovery & Sleep Quality Markers
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Cognitive Function & Neuroprotection
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={handleOrderLabs}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg"
            >
              Explore All Lab Tests
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Custom panels available • Same-day results • Nationwide collection centers
            </p>
          </div>
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
              Practitioner-Grade Supplements at 25% Off
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 md:mb-8 text-center px-2">
              Powered by Fullscript — 13,000+ premium products, direct from manufacturers.
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
                  <span>25% off retail prices</span>
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