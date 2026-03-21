import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '@/context/AuthContext';

interface RoleSelectionSignupProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
}

const RoleSelectionSignup: React.FC<RoleSelectionSignupProps> = ({ onSelectRole, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
        <div className="relative px-4 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🌾 Join FarmDirect
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
              Create an account and start connecting directly with farmers or buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection Cards */}
      <div className="px-4 pb-16 mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role to Sign Up</h2>
          <p className="text-gray-600">Select the role that best fits your needs</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Farmer Card */}
          <Card className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-green-400 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🧑‍🌾</div>
              <CardTitle className="text-2xl text-green-700">I'm a Farmer</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Sell your crops directly to buyers without intermediaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Direct Sales:</strong> List your crops with photos and reach buyers directly
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Set Prices:</strong> Control your pricing to maximize profits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Chat with Buyers:</strong> Direct communication channel with potential customers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Order Tracking:</strong> Monitor all your orders in real-time
                  </span>
                </li>
              </ul>
              <Button 
                onClick={() => onSelectRole('farmer')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium transition-all"
              >
                Sign Up as Farmer
              </Button>
            </CardContent>
          </Card>

          {/* Buyer Card */}
          <Card className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-blue-400 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🧑‍💼</div>
              <CardTitle className="text-2xl text-blue-700">I'm a Buyer</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Buy fresh produce directly from local farmers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Fresh Produce:</strong> Browse farm-fresh vegetables and fruits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Better Prices:</strong> Direct sourcing eliminates middlemen markups
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Compare & Select:</strong> Review quality and pricing from multiple farmers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl mt-0.5">✓</span>
                  <span className="text-gray-700">
                    <strong>Flexible Options:</strong> Multiple payment methods for your convenience
                  </span>
                </li>
              </ul>
              <Button 
                onClick={() => onSelectRole('buyer')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium transition-all"
              >
                Sign Up as Buyer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Card (Optional) */}
        <Card className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-purple-400 overflow-hidden mb-8">
          <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
          <CardHeader className="text-center pb-4">
            <div className="text-6xl mb-4">🔐</div>
            <CardTitle className="text-2xl text-purple-700">Administrator</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Platform administration and management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Management Features:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">→</span>
                    <span className="text-gray-600 text-sm">User management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">→</span>
                    <span className="text-gray-600 text-sm">Platform analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">→</span>
                    <span className="text-gray-600 text-sm">Listing approvals</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Admin Capabilities:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">→</span>
                    <span className="text-gray-600 text-sm">System configuration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">→</span>
                    <span className="text-gray-600 text-sm">Platform monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">→</span>
                    <span className="text-gray-600 text-sm">User support</span>
                  </li>
                </ul>
              </div>
            </div>
            <Button 
              onClick={() => onSelectRole('admin')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium transition-all"
            >
              Admin Registration
            </Button>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-center text-green-700">Why Choose FarmDirect?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <h4 className="font-semibold text-gray-900 mb-2">Fair Prices</h4>
                <p className="text-sm text-gray-600">No middlemen means better prices for both farmers and buyers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h4 className="font-semibold text-gray-900 mb-2">Fresh Produce</h4>
                <p className="text-sm text-gray-600">Direct from farm to your table, guaranteed freshness</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
                <p className="text-sm text-gray-600">Build meaningful relationships between farmers and buyers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelectionSignup;
