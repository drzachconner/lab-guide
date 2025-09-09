import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { plans, formatPrice, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  const handleUpgrade = (planTier: string) => {
    // This would integrate with Stripe when ready
    console.log('Upgrade to plan:', planTier);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Clinic-branded lab interpretation portal with AI-powered analysis, 
            Fullscript integration, and comprehensive patient management.
          </p>
          
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('monthly')}
              className="px-6"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('annual')}
              className="px-6"
            >
              Annual
              <Badge variant="secondary" className="ml-2">Save 16%</Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const price = billingCycle === 'monthly' ? plan.monthly_price : plan.annual_price;
            const monthlyEquivalent = billingCycle === 'annual' ? Math.round(price / 12) : price;
            const isPopular = plan.tier === 'growth';
            
            return (
              <Card 
                key={plan.id} 
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                  isPopular && "border-primary shadow-lg scale-105"
                )}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    <Crown className="inline w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={cn("text-center", isPopular && "pt-12")}>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-lg">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(monthlyEquivalent)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                    {billingCycle === 'annual' && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually ({formatPrice(price)}/year)
                      </div>
                    )}
                  </CardDescription>
                  
                  <div className="text-sm text-muted-foreground">
                    Up to {plan.monthly_reports} AI reports/month
                  </div>
                  {plan.overage_price > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Overage: {formatPrice(plan.overage_price)}/report
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan.tier)}
                  >
                    {index === 0 ? 'Start Free Trial' : 'Upgrade Now'}
                  </Button>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.staff_seats && (
                      <div className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          {plan.staff_seats === 1 ? '1 staff seat' : `${plan.staff_seats} staff seats`}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <div className="text-center bg-muted rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            For enterprise-level implementations, custom integrations, or white-label solutions, 
            we offer tailored packages to meet your specific needs.
          </p>
          <Button size="lg" variant="outline">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}