
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
    <div className="relative min-h-screen overflow-hidden bg-[#edf9f4] text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.92),rgba(237,249,244,1))]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-emerald-200/45 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl animate-float" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-200/35 blur-3xl animate-pulse-soft" />

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="relative px-4 pt-10 pb-14 mx-auto max-w-6xl sm:px-6 lg:pt-14">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/80 bg-white/75 px-6 py-12 text-center shadow-[0_30px_90px_-35px_rgba(15,23,42,0.34)] backdrop-blur-2xl sm:px-10 animate-fade-in-scale">
            <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
            <h1 className="mb-4 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              🌾 FarmDirect
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Connecting farmers directly with buyers. No middlemen, fair prices, fresh produce.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-emerald-700 shadow-[0_12px_30px_-18px_rgba(16,185,129,0.55)]">
              <span className="text-sm font-medium">🚀 Empowering Rural Communities</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 px-4 pb-16 mx-auto max-w-6xl sm:px-6">
        <div className="mx-auto mb-12 max-w-4xl rounded-[2rem] border border-white/80 bg-white/78 px-5 py-8 shadow-[0_26px_70px_-35px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:px-8 animate-fade-in-scale">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight text-slate-900">Get Started Today</h2>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button
                onClick={() => setViewState('role-selection-signup')}
                className="h-auto rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-emerald-600/30"
              >
                Create Account
              </Button>
              <Button
                onClick={() => setViewState('role-selection-login')}
                variant="outline"
                className="h-auto rounded-full border-slate-300 px-8 py-3 text-lg font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:bg-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  setSelectedRole('admin');
                  setAuthMode('login');
                  setViewState('auth-form');
                }}
                variant="outline"
                className="h-auto rounded-full border-violet-300 px-8 py-3 text-lg font-semibold text-violet-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-400 hover:bg-violet-50"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>

        {/* Main Role Selection */}
        <div className="mb-14">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900">Choose Your Role</h2>
            <p className="text-slate-600">Join our marketplace as a farmer or buyer</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Farmer Card */}
            <Card className="group overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white/90 shadow-[0_20px_60px_-34px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_80px_-34px_rgba(15,23,42,0.45)]">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-300" />
              <CardHeader className="pb-4 pt-8 text-center">
                <div className="mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">🧑‍🌾</div>
                <CardTitle className="text-2xl font-semibold text-emerald-700">I'm a Farmer</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Sell your crops directly to buyers without intermediaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-7">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <span className="mr-2 text-emerald-500">✓</span>
                    List your crops with photos
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-emerald-500">✓</span>
                    Set your own prices
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-emerald-500">✓</span>
                    Chat directly with buyers
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-emerald-500">✓</span>
                    Track your orders
                  </li>
                </ul>
                <Button
                  onClick={() => handleSignupRoleSelect('farmer')}
                  className="h-auto w-full rounded-full bg-emerald-600 py-3 text-lg font-semibold text-white shadow-md shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-emerald-600/30"
                >
                  Join as Farmer
                </Button>
              </CardContent>
            </Card>

            {/* Buyer Card */}
            <Card className="group overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white/90 shadow-[0_20px_60px_-34px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_28px_80px_-34px_rgba(15,23,42,0.45)]">
              <div className="h-1 bg-gradient-to-r from-sky-500 to-cyan-300" />
              <CardHeader className="pb-4 pt-8 text-center">
                <div className="mb-4 text-6xl transition-transform duration-300 group-hover:scale-110">🧑‍💼</div>
                <CardTitle className="text-2xl font-semibold text-sky-700">I'm a Buyer</CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Buy fresh produce directly from local farmers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-6 pb-7">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <span className="mr-2 text-sky-500">✓</span>
                    Browse fresh local produce
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-sky-500">✓</span>
                    Compare prices & quality
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-sky-500">✓</span>
                    Chat with farmers
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-sky-500">✓</span>
                    Flexible payment options
                  </li>
                </ul>
                <Button
                  onClick={() => handleSignupRoleSelect('buyer')}
                  className="h-auto w-full rounded-full bg-sky-600 py-3 text-lg font-semibold text-white shadow-md shadow-sky-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-700 hover:shadow-sky-600/30"
                >
                  Join as Buyer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 border-y border-white/70 bg-white/72 py-16 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-6xl sm:px-6">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900">Why Choose FarmDirect?</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-6 text-center shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Fair Prices</h4>
              <p className="text-slate-600">No middlemen means better prices for farmers and buyers</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-6 text-center shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Fresh Produce</h4>
              <p className="text-slate-600">Direct from farm to your table, ensuring maximum freshness</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-6 text-center shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="mb-2 text-xl font-semibold text-slate-900">Direct Connection</h4>
              <p className="text-slate-600">Build relationships between farmers and buyers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Trust Section */}
      <div className="relative z-10 px-4 py-16 mx-auto max-w-6xl sm:px-6">
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900">Security & Trust</h3>
          <p className="mx-auto max-w-3xl text-slate-600">
            Your data is safe with us. We implement industry-standard security practices to protect your information.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border border-white/80 bg-white/85 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <CardTitle className="text-slate-900">Secure Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Strong password requirements and encrypted storage</p>
            </CardContent>
          </Card>
          <Card className="border border-white/80 bg-white/85 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <CardTitle className="text-slate-900">Verified Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">All users verified for authentic connections</p>
            </CardContent>
          </Card>
          <Card className="border border-white/80 bg-white/85 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1">
            <CardHeader className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <CardTitle className="text-slate-900">Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Your personal information is never shared</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
