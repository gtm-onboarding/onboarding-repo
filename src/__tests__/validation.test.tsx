import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateZip,
  validateCardNumber,
  validateExpiry,
  validateCvv,
} from '../utils/validation';

describe('Email Validation', () => {
  it('validates email format on sign up', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('test.user+tag@sub.domain.com')).toBeNull();
    expect(validateEmail('asdf')).toBe('Please enter a valid email address');
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
    expect(validateEmail('@test.com')).toBe('Please enter a valid email address');
  });

  it('validates email format on sign in', () => {
    expect(validateEmail('valid@email.com')).toBeNull();
    expect(validateEmail('bad-email')).toBe('Please enter a valid email address');
    expect(validateEmail('')).toBe('Email is required');
  });

  it('displays inline error for invalid email', () => {
    const error = validateEmail('not-an-email');
    expect(error).toBe('Please enter a valid email address');
    expect(validateEmail('good@email.com')).toBeNull();
  });

  it('disables submit button when email is invalid', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('incomplete@')).toBe('Please enter a valid email address');
    expect(validateEmail('valid@test.com')).toBeNull();
  });
});

describe('Password Validation', () => {
  it('rejects empty password', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  it('rejects password shorter than 6 characters', () => {
    expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
    expect(validatePassword('ab')).toBe('Password must be at least 6 characters');
  });

  it('accepts password with 6 or more characters', () => {
    expect(validatePassword('123456')).toBeNull();
    expect(validatePassword('strongpassword')).toBeNull();
  });
});

describe('Password Confirmation Validation', () => {
  it('rejects empty confirmation', () => {
    expect(validateConfirmPassword('password', '')).toBe('Please confirm your password');
  });

  it('rejects mismatched passwords', () => {
    expect(validateConfirmPassword('password', 'different')).toBe('Passwords do not match');
  });

  it('accepts matching passwords', () => {
    expect(validateConfirmPassword('password', 'password')).toBeNull();
  });
});

describe('ZIP Code Validation', () => {
  it('accepts valid 5-digit ZIP', () => {
    expect(validateZip('12345')).toBeNull();
  });

  it('accepts valid 5+4 ZIP', () => {
    expect(validateZip('12345-6789')).toBeNull();
  });

  it('rejects invalid ZIP formats', () => {
    expect(validateZip('1234')).toBe('Please enter a valid ZIP code (e.g. 12345 or 12345-6789)');
    expect(validateZip('abcde')).toBe('Please enter a valid ZIP code (e.g. 12345 or 12345-6789)');
    expect(validateZip('123456')).toBe(
      'Please enter a valid ZIP code (e.g. 12345 or 12345-6789)',
    );
    expect(validateZip('')).toBe('ZIP code is required');
  });
});

describe('Card Number Validation', () => {
  it('accepts valid card numbers (13-19 digits)', () => {
    expect(validateCardNumber('4111111111111111')).toBeNull();
    expect(validateCardNumber('4111 1111 1111 1111')).toBeNull();
    expect(validateCardNumber('1234567890123')).toBeNull();
  });

  it('rejects card numbers with too few or too many digits', () => {
    expect(validateCardNumber('123456789012')).toBe('Card number must be 13–19 digits');
    expect(validateCardNumber('12345678901234567890')).toBe('Card number must be 13–19 digits');
  });

  it('rejects non-digit characters', () => {
    expect(validateCardNumber('abcd1234efgh5678')).toBe('Card number must contain only digits');
  });

  it('rejects empty card number', () => {
    expect(validateCardNumber('')).toBe('Card number is required');
  });
});

describe('Expiry Date Validation', () => {
  it('accepts valid MM/YY format', () => {
    expect(validateExpiry('12/30')).toBeNull();
    expect(validateExpiry('01/29')).toBeNull();
  });

  it('rejects invalid format', () => {
    expect(validateExpiry('13/25')).toBe('Please enter a valid expiry date (MM/YY)');
    expect(validateExpiry('00/25')).toBe('Please enter a valid expiry date (MM/YY)');
    expect(validateExpiry('1225')).toBe('Please enter a valid expiry date (MM/YY)');
    expect(validateExpiry('12/2025')).toBe('Please enter a valid expiry date (MM/YY)');
  });

  it('rejects expired cards', () => {
    expect(validateExpiry('01/20')).toBe('Card has expired');
  });

  it('rejects empty expiry', () => {
    expect(validateExpiry('')).toBe('Expiry date is required');
  });
});

describe('CVV Validation', () => {
  it('accepts valid 3-digit CVV', () => {
    expect(validateCvv('123')).toBeNull();
  });

  it('accepts valid 4-digit CVV', () => {
    expect(validateCvv('1234')).toBeNull();
  });

  it('rejects invalid CVV', () => {
    expect(validateCvv('12')).toBe('CVV must be 3 or 4 digits');
    expect(validateCvv('12345')).toBe('CVV must be 3 or 4 digits');
    expect(validateCvv('abc')).toBe('CVV must be 3 or 4 digits');
  });

  it('rejects empty CVV', () => {
    expect(validateCvv('')).toBe('CVV is required');
  });
});
