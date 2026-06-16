export function validateEmail(email: string): string | null {
  if (!email) {
    return null;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return null;
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}
