
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isProfileComplete, useAuth, UserRole, type User } from '@/context/AuthContext';
import EnhancedAuthForm from '@/components/EnhancedAuthForm';
import RoleSelection from '@/components/RoleSelection';
import RoleSelectionSignup from '@/components/RoleSelectionSignup';

type ViewState = 'home' | 'role-selection-signup' | 'role-selection-login' | 'auth-form';

// Helper function to get dashboard path based on role
const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'buyer':
      return '/buyer/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, selectedRole, setCurrentUser, setSelectedRole, logout } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Check if user is already logged in - redirect to role-specific dashboard
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'farmer' && !isProfileComplete(currentUser)) {
        navigate('/complete-profile', { replace: true });
        return;
      }

      const dashboardPath = getDashboardPath(currentUser.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignupRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode('signup');
    setViewState('auth-form');
  };

  const handleLoginRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode('login');
    setViewState('auth-form');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    // Navigation will be handled by the useEffect above
  };

  const handleBackFromAuth = () => {
    setSelectedRole(null);
    setViewState('role-selection-signup');
  };

  const handleBackToHome = () => {
    setSelectedRole(null);
    setViewState('home');
  };

  const handleLogout = () => {
    logout();
    setViewState('home');
    setSelectedRole(null);
  };

  // Auth form view
  if (viewState === 'auth-form' && selectedRole) {
    return (
      <EnhancedAuthForm
        role={selectedRole}
        mode={authMode}
        onSuccess={handleAuthSuccess}
        onBack={handleBackFromAuth}
        onModeChange={(mode) => setAuthMode(mode)}
      />
    );
  }

  // Role selection for signup
  if (viewState === 'role-selection-signup') {
    return (
      <RoleSelectionSignup
        onSelectRole={handleSignupRoleSelect}
        onBack={handleBackToHome}
      />
    );
  }

  // Role selection for login
  if (viewState === 'role-selection-login') {
    return (
      <RoleSelection
        onSelectRole={handleLoginRoleSelect}
        onBack={handleBackToHome}
      />
    );
  }

  // Home view - Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
        <div className="relative px-4 py-16 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🌾 FarmDirect
            </h1>
            <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
              Connecting farmers directly with buyers. No middlemen, fair prices, fresh produce.
            </p>
            <div className="inline-flex items-center space-x-2 text-green-700 bg-green-100 px-4 py-2 rounded-full">
              <span className="text-sm font-medium">🚀 Empowering Rural Communities</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="px-4 pb-16 mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get Started Today</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setViewState('role-selection-signup')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium h-auto"
            >
              Create Account
            </Button>
            <Button
              onClick={() => setViewState('role-selection-login')}
              variant="outline"
              className="px-8 py-3 text-lg font-medium border-gray-300 hover:border-gray-400 h-auto"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Main Role Selection */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-gray-600">Join our marketplace as a farmer or buyer</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Farmer Card */}
            <Card className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-green-400">
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">🧑‍🌾</div>
                <CardTitle className="text-2xl text-green-700">I'm a Farmer</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Sell your crops directly to buyers without intermediaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    List your crops with photos
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Set your own prices
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Chat directly with buyers
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Track your orders
                  </li>
                </ul>
                <Button
                  onClick={() => handleSignupRoleSelect('farmer')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                >
                  Join as Farmer
                </Button>
              </CardContent>
            </Card>

            {/* Buyer Card */}
            <Card className="cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl border-2 hover:border-blue-400">
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4">🧑‍💼</div>
                <CardTitle className="text-2xl text-blue-700">I'm a Buyer</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Buy fresh produce directly from local farmers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Browse fresh local produce
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Compare prices & quality
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Chat with farmers
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-500 mr-2">✓</span>
                    Flexible payment options
                  </li>
                </ul>
                <Button
                  onClick={() => handleSignupRoleSelect('buyer')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                >
                  Join as Buyer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="px-4 mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FarmDirect?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-2">Fair Prices</h4>
              <p className="text-gray-600">No middlemen means better prices for farmers and buyers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="text-xl font-semibold mb-2">Fresh Produce</h4>
              <p className="text-gray-600">Direct from farm to your table, ensuring maximum freshness</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-xl font-semibold mb-2">Direct Connection</h4>
              <p className="text-gray-600">Build relationships between farmers and buyers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Trust Section */}
      <div className="px-4 py-16 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Security & Trust</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Your data is safe with us. We implement industry-standard security practices to protect your information.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <CardTitle>Secure Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Strong password requirements and encrypted storage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <CardTitle>Verified Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">All users verified for authentic connections</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Your personal information is never shared</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
