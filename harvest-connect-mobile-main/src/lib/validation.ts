// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requiresUppercase: true,
  requiresLowercase: true,
  requiresNumbers: true,
  requiresSpecialChars: true,
};

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validate email
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Validate password strength
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
  }
  
  if (PASSWORD_REQUIREMENTS.requiresUppercase && !/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (PASSWORD_REQUIREMENTS.requiresLowercase && !/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (PASSWORD_REQUIREMENTS.requiresNumbers && !/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (PASSWORD_REQUIREMENTS.requiresSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*)';
  }
  
  return null;
};

// Validate name
export const validateName = (name: string): string | null => {
  if (!name || name.trim() === '') {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (name.trim().length > 100) {
    return 'Name must be less than 100 characters';
  }
  return null;
};

// Validate phone number (basic validation)
export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return 'Phone number is required';
  }
  const phoneRegex = /^[0-9\s\-\+\(\)]{7,}$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// Validate location
export const validateLocation = (location: string): string | null => {
  if (!location || location.trim() === '') {
    return 'Location is required';
  }
  if (location.trim().length < 3) {
    return 'Location must be at least 3 characters';
  }
  return null;
};

// Validate password match
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

// Validate signup form
export const validateSignupForm = (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  location: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const nameError = validateName(formData.name);
  if (nameError) errors.push({ field: 'name', message: nameError });

  const emailError = validateEmail(formData.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  const passwordMatchError = validatePasswordMatch(formData.password, formData.confirmPassword);
  if (passwordMatchError) errors.push({ field: 'confirmPassword', message: passwordMatchError });

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.push({ field: 'phone', message: phoneError });

  const locationError = validateLocation(formData.location);
  if (locationError) errors.push({ field: 'location', message: locationError });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate login form
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(formData.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  if (!formData.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get password strength percentage
export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= PASSWORD_REQUIREMENTS.minLength) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/\d/.test(password)) strength += 20;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 20;
  
  return Math.min(strength, 100);
};

// Get password strength label
export const getPasswordStrengthLabel = (password: string): { label: string; color: string } => {
  const strength = getPasswordStrength(password);
  
  if (strength < 40) return { label: 'Weak', color: 'red' };
  if (strength < 70) return { label: 'Fair', color: 'yellow' };
  return { label: 'Strong', color: 'green' };
};
