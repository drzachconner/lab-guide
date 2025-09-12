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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { signUp, signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const authType = searchParams.get('type') || 'analysis';

  // HIPAA-compliant password validation
  const validatePassword = (password: string): string => {
    if (password.length < 12) {
      return 'Password must be at least 12 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return 'Password must contain at least one special character';
    }
    if (/(.)\1{2,}/.test(password)) {
      return 'Password cannot contain 3 or more consecutive identical characters';
    }
    
    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456789', 'qwertyuiop', 'administrator', 
      'healthcare123', 'medical123', 'hospital123'
    ];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      return 'Password cannot contain common words or patterns';
    }
    
    return '';
  };

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (isSignUp && newPassword) {
      const error = validatePassword(newPassword);
      setPasswordError(error);
    } else {
      setPasswordError('');
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check URL params to determine default tab
    const tab = searchParams.get('tab');
    if (tab === 'signin') {
      setIsSignUp(false);
    } else {
      // Default to signup for new users
      setIsSignUp(true);
    }
  }, [searchParams]);

  const getAuthContent = () => {
    switch (authType) {
      case 'dispensary':
        return {
          title: 'Shop Premium Supplements',
          subtitle: 'Access 13,000+ professional-grade supplements at 25% off',
          icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
          badge: 'Dispensary Access',
          benefits: [
            '25% off retail prices',
            '13,000+ professional-grade products',
            'Direct from manufacturers',
            'Fast shipping & easy returns'
          ]
        };
      case 'analysis':
        return {
          title: 'Complete Lab Analysis + Dispensary',
          subtitle: 'Get AI-powered lab insights plus dispensary access',
          icon: <Brain className="h-8 w-8 text-blue-600" />,
          badge: 'Full Platform Access',
          benefits: [
            '$19 comprehensive lab analysis',
            'AI-powered health insights',
            'Personalized supplement protocols',
            '25% dispensary discount'
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
        // Validate password for signup
        const pwdError = validatePassword(password);
        if (pwdError) {
          toast({
            title: "Password requirements not met",
            description: pwdError,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const fullNameForSignup = `${firstName} ${lastName}`.trim();
        const { error } = await signUp(email, password, fullNameForSignup);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          // Call Fullscript integration edge function
          // TODO: Implement Fullscript account creation with firstName, lastName, dateOfBirth
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google sign in failed", 
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = getAuthContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div 
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => navigate('/')}
          >
            <span className="text-gray-500">Biohack</span><span className="text-blue-600">Labs</span><span className="text-gray-500">.ai</span>
          </div>

          <div className="w-24"></div> {/* Spacer to center logo */}
        </div>
      </nav>

      <div className="flex items-center justify-center p-4 pt-8">
        <div className="max-w-md w-full">

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
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>
                </>
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
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    placeholder={isSignUp ? "Create password" : "Enter your password"}
                    className={`pr-10 ${passwordError ? 'border-red-500' : ''}`}
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
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
                {isSignUp && (
                  <div className="mt-2 text-xs text-gray-600">
                    <p className="font-medium mb-1">Password requirements:</p>
                    <ul className="space-y-0.5 text-gray-500">
                      <li>• At least 12 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Contains at least one number and special character</li>
                      <li>• No common words or repeated characters</li>
                    </ul>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading || (isSignUp && passwordError !== '')}
              >
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
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
              Shop Dispensary Only (25% Off)
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Auth;