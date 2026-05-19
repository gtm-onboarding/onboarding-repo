const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function getEmailError(email: string): string | null {
  if (!email) return null;
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return null;
}

export function getPasswordConfirmError(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) return null;
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
}
