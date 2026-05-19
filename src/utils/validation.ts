const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email) {
    return null;
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) {
    return null;
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}
