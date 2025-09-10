import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, ShoppingCart, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const authType = searchParams.get('type') || 'analysis';

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Set default to sign up for new users, sign in for returning users
    if (authType === 'signin') {
      setIsSignUp(false);
    } else {
      setIsSignUp(true);
    }
  }, [authType]);

  const getAuthContent = () => {
    switch (authType) {
      case 'dispensary':
        return {
          title: 'Shop Premium Supplements',
          subtitle: 'Access 13,000+ professional-grade supplements at 30% off',
          icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
          badge: 'Dispensary Access',
          benefits: [
            '30% off retail prices (25% in Canada)',
            '13,000+ professional-grade products',
            'Direct from manufacturers',
            'Fast shipping & easy returns'
          ]
        };
      case 'analysis':
        return {
          title: 'Complete Lab Analysis + Dispensary',
          subtitle: 'Get AI-powered lab insights plus lifetime dispensary access',
          icon: <Brain className="h-8 w-8 text-blue-600" />,
          badge: 'Full Platform Access',
          benefits: [
            '$19 comprehensive lab analysis',
            'AI-powered health insights',
            'Personalized supplement protocols',
            'Lifetime 30% dispensary discount'
          ]
        };
      default:
        return {
          title: 'Welcome Back',
          subtitle: 'Sign in to access your account',
          icon: <Brain className="h-8 w-8 text-blue-600" />,
          badge: 'Sign In',
          benefits: []
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          // Call Fullscript integration edge function
          // TODO: Implement Fullscript account creation
          toast({
            title: "Account created successfully!",
            description: "Please check your email to confirm your account."
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = getAuthContent();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-2xl font-bold text-gray-900 mb-2">
            <span className="text-gray-500">Biohack</span>
            <span className="text-blue-600">Labs</span>
            <span className="text-gray-500">.ai</span>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {content.icon}
            </div>
            
            <Badge className="mb-4 mx-auto bg-blue-50 text-blue-700 border-blue-200">
              {content.badge}
            </Badge>
            
            <CardTitle className="text-2xl">{content.title}</CardTitle>
            <CardDescription className="text-base">
              {content.subtitle}
            </CardDescription>
            
            {content.benefits.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="text-sm font-medium text-gray-900 mb-2">What you get:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Additional dispensary signup option */}
        {authType === 'analysis' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Just want supplement access?</p>
            <Button
              variant="outline"
              onClick={() => navigate('/auth?type=dispensary')}
              className="text-sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shop Dispensary Only (30% Off)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;