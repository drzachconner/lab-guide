import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ShoppingCart, Percent, CheckCircle, ExternalLink } from "lucide-react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useFullscriptIntegration } from "@/hooks/useFullscriptIntegration";

interface DispensaryAccessProps {
  clinicContext?: {
    name: string;
    fullscripts_dispensary_url?: string;
  };
  onPurchaseAnalysis?: () => void;
}

export function DispensaryAccess({ clinicContext, onPurchaseAnalysis }: DispensaryAccessProps) {
  const { hasDispensaryAccess, loading } = usePaymentStatus();
  const { openDispensary, createFullscriptAccount, creatingAccount } = useFullscriptIntegration();

  if (loading) {
    return (
      <Card className="card-medical">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse text-muted-foreground">Loading dispensary access...</div>
        </CardContent>
      </Card>
    );
  }

  if (hasDispensaryAccess) {
    return (
      <Card className="card-medical border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Fullscript Dispensary Access Active</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            You now have lifetime access to professional-grade supplements at 15% discount
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Percent className="h-3 w-3 mr-1" />
                15% Discount Active
              </Badge>
              <span className="text-sm text-green-700">Storewide savings applied automatically</span>
            </div>
            <Button 
              onClick={() => openDispensary(clinicContext?.fullscripts_dispensary_url)}
              className="bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Shop Supplements
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-medical border-amber-200 bg-amber-50/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800">Unlock Fullscript Dispensary Access</CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          Get lifetime access to professional-grade supplements at 15% discount with your first lab analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white/60 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">What's Included:</h4>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                15% storewide discount on all supplements (5% better than standard)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Access to practitioner-grade formulations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free shipping on orders over $50
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Personalized supplement recommendations from your lab analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Lifetime access - no recurring fees
              </li>
            </ul>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Unlock with lab analysis purchase</div>
              <div className="text-lg font-semibold text-amber-800">
                {clinicContext ? "$29" : "$89"} one-time
              </div>
            </div>
            <Button 
              onClick={onPurchaseAnalysis}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Purchase Lab Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}