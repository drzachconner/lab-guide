import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Zap, LogIn, Heart, Brain, Pill, Sparkles, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

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

// Simple connected lines animation for hero and footer sections  
const ConnectedLinesAnimation = ({ variant = "hero" }: { variant?: "hero" | "footer" }) => {
  const strokeColor = variant === "hero" ? "rgba(180, 83, 9, 0.3)" : "rgba(180, 83, 9, 0.2)";
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Network of connected lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = Math.random() * 100;
          const y2 = Math.random() * 100;
          
          return (
            <motion.line
              key={`connection-${i}`}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={strokeColor}
              strokeWidth="1"
              opacity={0}
              animate={{
                opacity: [0, 0.7, 0],
                x1: [`${x1}%`, `${x1 + (Math.random() * 15 - 7.5)}%`, `${x1}%`],
                y1: [`${y1}%`, `${y1 + (Math.random() * 15 - 7.5)}%`, `${y1}%`],
                x2: [`${x2}%`, `${x2 + (Math.random() * 15 - 7.5)}%`, `${x2}%`],
                y2: [`${y2}%`, `${y2 + (Math.random() * 15 - 7.5)}%`, `${y2}%`],
              }}
              transition={{
                duration: Math.random() * 10 + 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          );
        })}

        {/* Animated connection nodes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const cx = Math.random() * 100;
          const cy = Math.random() * 100;
          
          return (
            <motion.circle
              key={`node-${i}`}
              cx={`${cx}%`}
              cy={`${cy}%`}
              r="2"
              fill={strokeColor}
              opacity={0}
              animate={{
                opacity: [0, 1, 0],
                r: [1, 3, 1],
                cx: [`${cx}%`, `${cx + (Math.random() * 12 - 6)}%`, `${cx}%`],
                cy: [`${cy}%`, `${cy + (Math.random() * 12 - 6)}%`, `${cy}%`],
              }}
              transition={{
                duration: Math.random() * 12 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.7,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Animated feature card
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { 
  icon: any, 
  title: string, 
  description: string, 
  delay?: number 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <Card className="bg-white rounded-xl shadow-sm border border-gray-100 h-full p-8 group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <motion.div 
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-100 flex items-center justify-center"
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-8 w-8 text-orange-600" />
          </motion.div>
          
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
              {title}
            </CardTitle>
          </CardHeader>
          
          <p className="text-gray-700 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const LandingPage = ({ clinicContext }: LandingPageProps = {}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

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
    <div ref={containerRef} className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-sm border-b border-gray-200 relative z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="text-2xl font-bold text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {clinicContext ? clinicContext.name : "BiohackLabs.ai"}
            </motion.div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Dashboard
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignIn}
                    className="text-gray-700 hover:text-orange-600"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Connected Lines Animation */}
      <section className="bg-amber-50 py-20 lg:py-32 relative overflow-hidden">
        <ConnectedLinesAnimation variant="hero" />
        
        <motion.div 
          className="container mx-auto px-6 text-center relative z-10"
          style={{ y: textY }}
        >
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Get direct access to{" "}
                <span className="text-amber-700">provider-quality supplements</span>{" "}
                tailored to your lab work at{" "}
                <span className="text-orange-600">25% discount</span>
              </h1>
              
              <motion.p 
                className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Choose from <strong>13,000+</strong> premium supplements and wellness products with AI-powered lab interpretation that connects you directly to the exact dosing and duration protocols you need.
              </motion.p>
            </motion.div>

            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-amber-200"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                There are plenty of AI lab interpretations and supplement tracking tools out there. But they either don't link you directly to the supplements you need with exact dosing and duration protocols tailored to your lab work based on the leading edge of biohacking and functional medicine training, or they do and the prices are so far out of reach you could spend thousands for a protocol.
              </p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white"
            >
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                This biohacking functional medicine lab interpretation connects you directly to the exact premium supplements you need at the best prices available online.
              </h2>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Badge className="px-4 py-2 bg-white/20 border-white/30 text-white">
                  25% Lifelong Discount
                </Badge>
                <Badge className="px-4 py-2 bg-white/20 border-white/30 text-white">
                  13,000+ Products
                </Badge>
                <Badge className="px-4 py-2 bg-white/20 border-white/30 text-white">
                  Exact Dosing Protocols
                </Badge>
              </div>
            </motion.div>

            {/* Main CTA */}
            <motion.div 
              className="pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xl px-12 py-6 h-auto rounded-2xl font-semibold group" 
                  onClick={handleGetStarted}
                >
                  <span className="flex items-center">
                    Start Lab Analysis - $19
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
              
              <p className="text-sm text-gray-600 mt-4">
                One-time payment • Multiple labs per session • Lifelong supplement discount
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-white relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Lab analysis that actually connects to{" "}
                <span className="text-orange-600">supplements you need</span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                The only platform that bridges advanced lab interpretation with direct access to professional-grade supplements at unbeatable prices.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Brain}
                title="AI-Powered Lab Analysis"
                description="Upload multiple lab reports in one $19 session. Our AI specializes in biohacking and functional medicine, uncovering patterns generic tools miss. Get optimization-focused insights beyond basic 'normal' ranges with detailed visual breakdowns and actionable protocols."
                delay={0}
              />
              
              <FeatureCard
                icon={Pill}
                title="Direct Supplement Connection"
                description="Every insight connects directly to specific supplements from our 13,000+ product catalog. Get exact dosing recommendations, duration protocols, and timing instructions tailored to your lab results. No more guesswork or hours of research."
                delay={0.2}
              />
              
              <FeatureCard
                icon={Sparkles}
                title="25% Lifelong Discount"
                description="Unlock permanent access to professional-grade supplements at 25% off retail prices—the best prices available online. One analysis gives you lifelong savings on everything from basic vitamins to cutting-edge nootropics and longevity compounds."
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps with Clean Design */}
      <section className="py-20 lg:py-32 bg-gray-50 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                How it works
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                From lab upload to supplement delivery—streamlined for optimal results.
              </p>
            </motion.div>

            {/* Process Steps */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Upload Your Labs",
                  description: "Securely upload multiple lab reports in one session. Works with any provider—Quest, LabCorp, Jason Health, or your local clinic.",
                  icon: TrendingUp
                },
                {
                  step: "2", 
                  title: "AI Analysis & Supplement Matching",
                  description: "Our biohacking-trained AI analyzes your results and instantly matches you to specific supplements with exact dosing protocols.",
                  icon: Brain
                },
                {
                  step: "3",
                  title: "Get Your Protocol & Discount Access",
                  description: "Receive detailed recommendations with direct links to supplements at 25% off. One analysis unlocks lifelong discount access to 13,000+ products.",
                  icon: Pill
                },
                {
                  step: "4",
                  title: "Order & Track",
                  description: "Order directly through our platform with your permanent discount. Track progress with automated retest reminders.",
                  icon: Target
                },
                {
                  step: "5",
                  title: "Optimize & Repeat",
                  description: "Upload new labs anytime for protocol updates. Your discount access never expires, and you can refine protocols as you progress.",
                  icon: Sparkles
                },
                {
                  step: "6",
                  title: "Maintain Long-term", 
                  description: "One-click reordering, automatic refills, and ongoing access to new supplement recommendations as our catalog grows.",
                  icon: CheckCircle
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <step.icon className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Connected Lines Animation */}
      <footer className="bg-orange-600 py-16 relative overflow-hidden">
        <ConnectedLinesAnimation variant="footer" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Get the supplements your labs actually recommend
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Stop guessing. Get personalized supplement protocols with exact dosing at the best prices available online.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-12 py-6 h-auto rounded-2xl font-semibold group" 
                  onClick={handleGetStarted}
                >
                  <span className="flex items-center">
                    {user ? 'Go to Dashboard' : 'Start Analysis - $19'}
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/90">
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  13,000+ Premium Products
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  25% Lifelong Discount
                </span>
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Best Prices Available Online
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;