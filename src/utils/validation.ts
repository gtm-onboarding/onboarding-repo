const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function getEmailError(email: string): string {
  if (!email) {
    return '';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
}

export function getPasswordConfirmError(password: string, confirmPassword: string): string {
  if (!confirmPassword) {
    return '';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
}
