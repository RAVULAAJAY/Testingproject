import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '@/context/AuthContext';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, onBack }) => {
  const roles: { id: UserRole; label: string; emoji: string; description: string; color: string; benefits: string[] }[] = [
    {
      id: 'farmer',
      label: 'Farmer',
      emoji: '🧑‍🌾',
      description: 'Sell your crops directly to buyers',
      color: 'green',
      benefits: [
        'Set your own prices',
        'Direct buyer contact',
        'Real-time order tracking',
        'Build long-term relationships'
      ]
    },
    {
      id: 'buyer',
      label: 'Buyer',
      emoji: '🧑‍💼',
      description: 'Buy fresh produce from local farmers',
      color: 'blue',
      benefits: [
        'Fresh farm produce',
        'Better prices',
        'Direct farmer communication',
        'Quality assurance'
      ]
    },
    {
      id: 'admin',
      label: 'Admin',
      emoji: '🔐',
      description: 'Platform administration',
      color: 'purple',
      benefits: [
        'User management',
        'Platform analytics',
        'Listing approvals',
        'System configuration'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="absolute left-4 top-4 p-2 h-auto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Sign In to FarmDirect
          </h1>
          <p className="text-lg text-gray-600">
            Choose your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <Card 
              key={role.id}
              className={`cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-${role.color}-400`}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-5xl mb-4">{role.emoji}</div>
                <CardTitle className={`text-2xl text-${role.color}-700`}>
                  {role.label}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {role.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {role.id === 'admin' && (
                  <Button
                    onClick={() => onSelectRole(role.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-base font-medium transition-all"
                  >
                    Admin Login
                  </Button>
                )}

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Key Benefits:</p>
                  <ul className="space-y-2">
                    {role.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className={`text-${role.color}-500 font-bold text-lg leading-none`}>✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {role.id !== 'admin' && (
                  <Button 
                    onClick={() => onSelectRole(role.id)}
                    className={`w-full bg-${role.color}-600 hover:bg-${role.color}-700 text-white py-6 text-lg font-medium transition-all`}
                  >
                    Sign In as {role.label}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">New to FarmDirect?</h3>
                <p className="text-sm text-blue-800">
                  On the next screen, you'll have the option to create a new account. Choose the same role you're signing in with, and we'll guide you through the registration process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;
