import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ShoppingCart, 
  Upload, 
  FileText, 
  LogOut, 
  User,
  TrendingUp,
  Activity,
  Star,
  ExternalLink
} from 'lucide-react';
import { useLabReports } from '@/hooks/useLabReports';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { api } from '@/lib/apiClient';
import type { ProfileT } from '@/types/zod';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileT | null>(null);
  const { reports, loading: reportsLoading } = useLabReports();
  const { hasPaidAnalysis, hasDispensaryAccess } = usePaymentStatus();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Fetch user profile using typed API client
    const fetchProfile = async () => {
      try {
        const profileData = await api.getMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAnalysisUpload = () => {
    // Navigate to lab analysis page
    navigate('/analysis');
  };

  const handleDispensaryAccess = () => {
    // Open Fullscript dispensary in new tab
    window.open('https://supplements.labpilot.com', '_blank');
  };

  if (!user) return null;

  const analysisCount = reports.length;
  const completedAnalysis = reports.filter(r => r.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            Dashboard
          </Badge>
          
          <div className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
            <span className="text-gray-500">Biohack</span><span className="text-blue-600">Labs</span><span className="text-gray-500">.ai</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {user.email}
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Health Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Access your lab interpretations and premium supplement dispensary
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{analysisCount}</div>
                  <div className="text-sm text-gray-600">Lab Reports Uploaded</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{completedAnalysis}</div>
                  <div className="text-sm text-gray-600">Completed Interpretations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">30%</div>
                  <div className="text-sm text-gray-600">Dispensary Discount</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lab Analysis Section */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle>Lab Analysis & Interpretation</CardTitle>
              </div>
              <CardDescription>
                Upload your lab work and get AI-powered biohacking insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hasPaidAnalysis ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Analysis Access Active</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Upload multiple lab reports for comprehensive analysis
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-blue-900 font-medium mb-2">Get Started - $19</div>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Upload multiple lab reports</li>
                      <li>• AI-powered biohacking analysis</li>
                      <li>• Personalized supplement protocols</li>
                      <li>• Lifetime dispensary access included</li>
                    </ul>
                  </div>
                )}

                <Button
                  onClick={handleAnalysisUpload}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {hasPaidAnalysis ? 'Upload New Labs' : 'Start Lab Analysis - $19'}
                </Button>

                {reports.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Reports</h4>
                    <div className="space-y-2">
                      {reports.slice(0, 3).map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{report.title}</span>
                          </div>
                          <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dispensary Access Section */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle>Premium Supplement Dispensary</CardTitle>
              </div>
              <CardDescription>
                Access 13,000+ professional-grade supplements at wholesale pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hasDispensaryAccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">30% Dispensary Discount Active</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Lifetime access to wholesale pricing (25% in Canada)
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-yellow-900 font-medium mb-2">Dispensary Access</div>
                    <p className="text-yellow-800 text-sm">
                      Complete your first lab analysis to unlock lifetime dispensary access
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900 mb-2">Dispensary Features:</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 13,000+ professional-grade products</li>
                    <li>• Direct from manufacturers</li>
                    <li>• 30% off retail prices (25% in Canada)</li>
                    <li>• Fast shipping & easy returns</li>
                    <li>• Practitioner-recommended brands</li>
                  </ul>
                </div>

                <Button
                  onClick={handleDispensaryAccess}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  disabled={!hasDispensaryAccess}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Shop Dispensary
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional sections for future features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coming Soon</CardTitle>
              <CardDescription>Advanced features in development</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Follow-up lab recommendations</li>
                <li>• Email reminders for retesting</li>
                <li>• Supplement refill notifications</li>
                <li>• Progress tracking & trends</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support</CardTitle>
              <CardDescription>Get help with your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;