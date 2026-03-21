import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  validateSignupForm, 
  validateLoginForm, 
  getPasswordStrengthLabel,
  ValidationError 
} from '@/lib/validation';
import { UserRole, type User } from '@/context/AuthContext';

interface EnhancedAuthFormProps {
  role: UserRole;
  mode: 'login' | 'signup';
  onSuccess: (user: User) => void;
  onBack: () => void;
  onModeChange: (mode: 'login' | 'signup') => void;
}

const EnhancedAuthForm: React.FC<EnhancedAuthFormProps> = ({ 
  role, 
  mode, 
  onSuccess, 
  onBack, 
  onModeChange 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const getRoleEmoji = (role: UserRole) => {
    switch(role) {
      case 'farmer': return '🧑‍🌾';
      case 'buyer': return '🧑‍💼';
      case 'admin': return '🔐';
      default: return '👤';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case 'farmer': return 'green';
      case 'buyer': return 'blue';
      case 'admin': return 'purple';
      default: return 'gray';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch(role) {
      case 'farmer': return 'Farmer';
      case 'buyer': return 'Buyer';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError('');
    setFieldErrors({});

    try {
      // Validate form
      const validationResult = mode === 'signup' 
        ? validateSignupForm(formData)
        : validateLoginForm(formData);

      if (!validationResult.isValid) {
        const errors: Record<string, string> = {};
        validationResult.errors.forEach((error: ValidationError) => {
          errors[error.field] = error.message;
        });
        setFieldErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create user object
      const user = {
        id: role === 'farmer' ? '1' : role === 'buyer' ? '2' : 'admin',
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        role: role,
        createdAt: new Date().toISOString()
      };

      // Call success callback
      onSuccess(user);
    } catch (error) {
      setGeneralError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = mode === 'signup' ? getPasswordStrengthLabel(formData.password) : null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-${getRoleColor(role)}-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4`}>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center relative pb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute left-4 top-4 p-2 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-5xl mb-4">{getRoleEmoji(role)}</div>
          <CardTitle className={`text-2xl text-${getRoleColor(role)}-700`}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? `Sign in to your ${getRoleLabel(role)} account` 
              : `Sign up as a ${getRoleLabel(role)}`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Error Message */}
            {generalError && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{generalError}</p>
              </div>
            )}

            {/* Name Field (Signup Only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`pr-10 ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {!fieldErrors.name && formData.name && (
                    <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                  )}
                </div>
                {fieldErrors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`pr-10 ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {!fieldErrors.email && formData.email && (
                  <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                )}
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.email}
                </p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                  className={`pr-10 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator (Signup Only) */}
              {mode === 'signup' && formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">Password Strength:</p>
                    <span className={`text-xs font-semibold text-${passwordStrength?.color}-600`}>
                      {passwordStrength?.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 bg-${passwordStrength?.color}-500`}
                      style={{
                        width: formData.password.length > 0 
                          ? Math.min((formData.password.length / 16) * 100, 100) + '%'
                          : '0%'
                      }}
                    />
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ One lowercase letter
                    </li>
                    <li className={/\d/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ One number
                    </li>
                    <li className={/[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/.test(formData.password) ? 'text-green-600' : ''}>
                      ✓ One special character
                    </li>
                  </ul>
                </div>
              )}
              
              {fieldErrors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field (Signup Only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`pr-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Phone Field (Signup Only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={`pr-10 ${fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {!fieldErrors.phone && formData.phone && (
                    <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                  )}
                </div>
                {fieldErrors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
            )}

            {/* Location Field (Signup Only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Location
                </Label>
                <div className="relative">
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder={role === 'farmer' ? 'Your farm location' : 'Your delivery address'}
                    className={`pr-10 ${fieldErrors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {!fieldErrors.location && formData.location && (
                    <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                  )}
                </div>
                {fieldErrors.location && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.location}
                  </p>
                )}
              </div>
            )}
            
            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-${getRoleColor(role)}-600 hover:bg-${getRoleColor(role)}-700 text-white py-2.5 font-medium transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting 
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>
          
          {/* Mode Toggle */}
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => {
                onModeChange(mode === 'login' ? 'signup' : 'login');
                setFieldErrors({});
                setGeneralError('');
              }}
              className={`text-${getRoleColor(role)}-600 hover:text-${getRoleColor(role)}-700 font-medium`}
            >
              {mode === 'login' ? 'Create account' : 'Sign in instead'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAuthForm;
