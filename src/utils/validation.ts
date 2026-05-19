const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const CVV_REGEX = /^\d{3,4}$/;
const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
}

export function validateName(name: string): string | null {
  if (!name) return 'Name is required';
  return null;
}

export function validateZip(zip: string): string | null {
  if (!zip) return 'ZIP code is required';
  if (!ZIP_REGEX.test(zip)) return 'Please enter a valid ZIP code (e.g. 12345 or 12345-6789)';
  return null;
}

export function validateCardNumber(cardNumber: string): string | null {
  if (!cardNumber) return 'Card number is required';
  const digits = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(digits)) return 'Card number must contain only digits';
  if (digits.length < 13 || digits.length > 19) return 'Card number must be 13–19 digits';
  return null;
}

export function validateExpiry(expiry: string): string | null {
  if (!expiry) return 'Expiry date is required';
  if (!EXPIRY_REGEX.test(expiry)) return 'Please enter a valid expiry date (MM/YY)';
  const [monthStr, yearStr] = expiry.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10) + 2000;
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  return null;
}

export function validateCvv(cvv: string): string | null {
  if (!cvv) return 'CVV is required';
  if (!CVV_REGEX.test(cvv)) return 'CVV must be 3 or 4 digits';
  return null;
}
