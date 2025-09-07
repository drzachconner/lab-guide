import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Calendar, 
  User, 
  CreditCard,
  Download,
  Plus,
  Clock,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import dashboardImage from "@/assets/dashboard-preview.jpg";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        setProfile(data);
      };
      
      fetchProfile();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-clinical">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
                <h1 className="text-xl font-bold">LabPilot</h1>
              </div>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Credits Remaining</div>
                <div className="font-semibold text-primary">5 analyses</div>
              </div>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Credits
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {profile?.full_name || user?.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Welcome back
                  </div>
                </div>
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Lab Report
                </CardTitle>
                <CardDescription>
                  Upload your lab results in PDF, CSV, or image format for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border/60 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Drop your lab report here</h3>
                      <p className="text-sm text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Supports PDF, CSV, JPG, PNG • Max 10MB
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button className="btn-medical">
                    <Upload className="h-4 w-4 mr-2" />
                    Select Lab Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: "Comprehensive Metabolic Panel", 
                      date: "Dec 15, 2024", 
                      status: "Completed",
                      findings: "3 optimization opportunities"
                    },
                    { 
                      name: "Lipid Panel & Inflammatory Markers", 
                      date: "Dec 10, 2024", 
                      status: "Completed",
                      findings: "2 red flags identified"
                    },
                    { 
                      name: "Thyroid Function Complete", 
                      date: "Dec 5, 2024", 
                      status: "Processing",
                      findings: "Analysis in progress..."
                    }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border/60 rounded-lg hover:shadow-card transition-all cursor-pointer">
                      <div className="flex-1">
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </span>
                          <Badge 
                            variant={report.status === "Completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{report.findings}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="text-lg">Health Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Optimization Score</span>
                    <span className="font-semibold text-secondary">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Based on latest analysis</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Red Flags</span>
                    <span className="font-semibold text-destructive">2</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Require attention</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tracking Progress</span>
                    <span className="font-semibold text-primary">5 markers</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Trending positive</p>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Preview */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  Analysis Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={dashboardImage} 
                  alt="Lab analysis dashboard preview"
                  className="w-full rounded-lg shadow-card"
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Real-time biomarker visualization and trend analysis
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Retest
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Trends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;