import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Trash2, 
  CreditCard,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LabPanelBrowser } from "@/components/LabPanelBrowser";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateLabFees, type FeeCalculationParams } from "@/utils/labFees";
import UnifiedBackground from "@/components/UnifiedBackground";

interface LabPanel {
  id: string;
  name: string;
  description: string;
  category: string; // Changed from literal union to string
  biomarkers: string[];
  base_price: number;
  lab_provider: string;
  sample_type: string;
  fasting_required: boolean;
  turnaround_days: number;
}

export function LabMarketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<LabPanel[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleAddToCart = (panel: LabPanel) => {
    if (!cartItems.some(item => item.id === panel.id)) {
      setCartItems([...cartItems, panel]);
      toast({
        title: "Added to cart",
        description: `${panel.name} has been added to your cart`
      });
    }
  };

  const handleRemoveFromCart = (panelId: string) => {
    setCartItems(cartItems.filter(item => item.id !== panelId));
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth?type=analysis');
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add lab panels to your cart first",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // First create the order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-lab-order', {
        body: {
          panelIds: cartItems.map(item => item.id),
          patientInfo: {
            fullName: user.user_metadata?.full_name || user.email,
            dateOfBirth: "1990-01-01", // TODO: Get from user profile
            address: {
              street: "123 Main St",
              city: "Anytown", 
              state: "CA",
              zipCode: "12345"
            }
          }
        }
      });

      if (orderError || !orderData?.success) {
        throw new Error(orderError?.message || orderData?.error || 'Failed to create order');
      }

      console.log('Order created:', orderData.order.orderNumber);

      // Then create payment session
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: {
          orderId: orderData.order.id,
          returnUrl: window.location.origin
        }
      });

      if (paymentError || !paymentData?.url) {
        throw new Error(paymentError?.message || paymentData?.error || 'Failed to create payment session');
      }

      // Clear cart and redirect to Stripe Checkout
      setCartItems([]);
      
      // Open Stripe Checkout in new tab
      window.open(paymentData.url, '_blank');
      
      // Navigate to a waiting page or dashboard
      navigate('/dashboard?order_pending=true');

      toast({
        title: "Redirecting to payment",
        description: `Order ${orderData.order.orderNumber} created. Complete payment in the new tab.`
      });

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to create order",
        variant: "destructive"
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const calculateTotal = () => {
    const labTotal = cartItems.reduce((sum, item) => sum + item.base_price, 0);
    const authFee = cartItems.length > 0 ? 1250 : 0; // $12.50 authorization fee
    const drawFee = cartItems.length > 0 ? 1000 : 0; // $10.00 draw fee
    const processingFee = Math.round(labTotal * 0.15); // 15% processing
    return {
      labTotal,
      authFee,
      drawFee,
      processingFee,
      total: labTotal + authFee + drawFee + processingFee
    };
  };

  const totals = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <UnifiedBackground variant="minimal" intensity="low" />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lab Marketplace</h1>
                <p className="text-gray-600">Order comprehensive lab testing with AI analysis included</p>
              </div>
            </div>
            
            {cartItems.length > 0 && (
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {cartItems.length} item{cartItems.length > 1 ? 's' : ''}
                </Badge>
                <span className="text-lg font-semibold">
                  Total: {formatPrice(totals.total)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lab Panels */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Available Lab Panels</h2>
              <p className="text-gray-600">
                All panels include practitioner authorization, AI functional medicine analysis, and supplement protocols.
              </p>
            </div>
            
            <LabPanelBrowser 
              onAddToCart={handleAddToCart}
              cartItems={cartItems}
            />
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Cart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <>
                      {/* Cart Items */}
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatPrice(item.base_price)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Pricing Breakdown */}
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lab panels:</span>
                          <span>{formatPrice(totals.labTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Authorization fee:</span>
                          <span>{formatPrice(totals.authFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Draw fee:</span>
                          <span>{formatPrice(totals.drawFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processing:</span>
                          <span>{formatPrice(totals.processingFee)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatPrice(totals.total)}</span>
                        </div>
                      </div>

                      {/* Payment Processor Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs text-blue-800 space-y-1">
                          <div className="font-medium">Payment Processing:</div>
                          <div>• Lab purchases & authorization fees: <span className="font-medium">Fullscript</span></div>
                          <div>• AI analysis fee: <span className="font-medium">BiohackLabs.ai</span></div>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <Button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Lab Testing</div>
                      <div className="text-gray-600">Quest or LabCorp collection</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">AI Analysis</div>
                      <div className="text-gray-600">GPT-5 functional medicine interpretation</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Supplement Protocol</div>
                      <div className="text-gray-600">Personalized recommendations with 25% discount</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">3-Day Results</div>
                      <div className="text-gray-600">Fast turnaround with digital delivery</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badge */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-900">HIPAA Compliant</div>
                  <div className="text-xs text-blue-700">Secure, encrypted processing</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabMarketplace;