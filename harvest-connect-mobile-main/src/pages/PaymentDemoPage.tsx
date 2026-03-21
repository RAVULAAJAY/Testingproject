import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PaymentPage from '@/pages/PaymentPage';
import PaymentSuccessScreen from '@/components/Payment/PaymentSuccessScreen';
import PaymentFailureScreen from '@/components/Payment/PaymentFailureScreen';
import { ArrowRight } from 'lucide-react';
import { OrderSummary } from '@/components/Payment/ProductSummary';

type DemoScreen = 'menu' | 'checkout' | 'success' | 'failure';

const PaymentDemoPage: React.FC = () => {
  const [screen, setScreen] = useState<DemoScreen>('menu');

  // Sample order data
  const sampleOrder: OrderSummary = {
    items: [
      {
        id: '1',
        name: 'Fresh Organic Tomatoes',
        quantity: 5,
        unit: 'kg',
        price: 40,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23EF4444"/%3E%3C/svg%3E'
      },
      {
        id: '2',
        name: 'Fresh Green Spinach',
        quantity: 2,
        unit: 'kg',
        price: 50,
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M50 20 Q70 30 70 50 Q70 70 50 80 Q30 70 30 50 Q30 30 50 20" fill="%23059669"/%3E%3C/svg%3E'
      }
    ],
    subtotal: 300,
    deliveryCharges: 0,
    taxes: 15,
    discount: 0,
    total: 315,
    deliveryAddress: '123 Main St, Sector 45, Noida, Uttar Pradesh 201301',
    deliveryDate: 'Tomorrow (11:00 AM - 2:00 PM)',
    sellerName: 'Green Valley Farms',
    sellerLocation: 'Sector 45, Noida'
  };

  if (screen === 'checkout') {
    return (
      <PaymentPage
        order={sampleOrder}
        onBack={() => setScreen('menu')}
        onSuccess={(orderId) => setScreen('success')}
        onFailure={() => setScreen('failure')}
      />
    );
  }

  if (screen === 'success') {
    return (
      <PaymentSuccessScreen
        orderId="ORD-1710829200123-456"
        totalAmount={315}
        sellerName="Green Valley Farms"
        deliveryDate="Tomorrow, 11:00 AM - 2:00 PM"
        deliveryAddress="123 Main St, Sector 45, Noida, Uttar Pradesh 201301"
        paymentMethod="UPI"
        itemsCount={2}
        onDownloadInvoice={() => alert('Invoice downloaded')}
        onShareOrder={() => alert('Order shared')}
        onViewOrder={() => setScreen('menu')}
        onBackHome={() => setScreen('menu')}
      />
    );
  }

  if (screen === 'failure') {
    return (
      <PaymentFailureScreen
        reason="card_declined"
        amount={315}
        onRetry={() => setScreen('checkout')}
        onChangeMethod={() => setScreen('checkout')}
        onGoBack={() => setScreen('menu')}
        onContactSupport={() => alert('Contact support')}
      />
    );
  }

  // Menu Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment System Demo
          </h1>
          <p className="text-gray-600 text-lg">
            Explore the complete payment flow with all screens and states
          </p>
        </div>

        {/* Screens Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checkout Screen */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-200 overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="h-40 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">💳</div>
                  <p className="text-sm font-medium text-gray-700 mt-2">Payment Checkout</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Checkout Flow
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Multi-step payment flow including order review, payment method selection, and processing
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>✓ Product summary with pricing breakdown</li>
                  <li>✓ Multiple payment method options</li>
                  <li>✓ Real-time processing animation</li>
                  <li>✓ Responsive design</li>
                </ul>
              </div>

              <Button
                onClick={() => setScreen('checkout')}
                className="w-full bg-green-600 hover:bg-green-700 gap-2 group-hover:gap-3 transition-all"
              >
                View Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Success Screen */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-green-200 overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="h-40 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">✅</div>
                  <p className="text-sm font-medium text-gray-700 mt-2">Payment Success</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Success Screen
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Post-payment confirmation screen with order details, tracking, and next steps
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>✓ Order confirmation with ID</li>
                  <li>✓ Status timeline progression</li>
                  <li>✓ Invoice & sharing options</li>
                  <li>✓ Contact seller integration</li>
                </ul>
              </div>

              <Button
                onClick={() => setScreen('success')}
                className="w-full bg-green-600 hover:bg-green-700 gap-2 group-hover:gap-3 transition-all"
              >
                View Success
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Failure Screen */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-red-200 overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="h-40 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">❌</div>
                  <p className="text-sm font-medium text-gray-700 mt-2">Payment Failed</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Failure Screen
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Error handling with recovery options and support guidelines
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>✓ Error reason explanation</li>
                  <li>✓ Helpful troubleshooting steps</li>
                  <li>✓ Retry & alternative options</li>
                  <li>✓ Support contact options</li>
                </ul>
              </div>

              <Button
                onClick={() => setScreen('failure')}
                className="w-full bg-red-600 hover:bg-red-700 gap-2 group-hover:gap-3 transition-all"
              >
                View Failure
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Product Summary */}
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-200 overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl">📦</div>
                  <p className="text-sm font-medium text-gray-700 mt-2">Order Summary</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Components Used
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Reusable payment components for different use cases
                </p>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li>✓ ProductSummary component</li>
                  <li>✓ PaymentOptions component</li>
                  <li>✓ PaymentSuccessScreen</li>
                  <li>✓ PaymentFailureScreen</li>
                </ul>
              </div>

              <Button
                onClick={() => setScreen('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 gap-2 group-hover:gap-3 transition-all"
              >
                View Components
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">
                SSL encrypted payments with secure transaction handling
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast</h3>
              <p className="text-sm text-gray-600">
                Instant payment processing with real-time status updates
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="font-semibold text-gray-900 mb-2">Responsive</h3>
              <p className="text-sm text-gray-600">
                Works seamlessly on mobile, tablet, and desktop devices
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDemoPage;
