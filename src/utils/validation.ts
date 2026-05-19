const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email) return null;
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return null;
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return null;
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
}
