import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const success = signUp(email, password, name);
    if (success) {
      navigate('/');
    } else {
      setError('An account with this email already exists');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '8px',
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    fontSize: '15px',
  };

  const labelStyle = {
    display: 'block' as const,
    color: theme.colors.text,
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', padding: '80px 24px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: theme.colors.surface,
          boxShadow: theme.shadows.lg,
          padding: '48px',
          borderRadius: '20px',
          maxWidth: '420px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontFamily: theme.fonts.display,
            color: theme.colors.text,
            marginBottom: '8px',
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: '600',
          }}
        >
          Create Account
        </h1>
        <p style={{ color: theme.colors.textMuted, textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>
          Join us and start shopping
        </p>
        {error && (
          <div
            style={{
              backgroundColor: theme.colors.errorBg,
              color: theme.colors.error,
              padding: '14px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {error}
          </div>
        )}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: theme.colors.primary,
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            width: '100%',
            marginBottom: '24px',
            letterSpacing: '0.3px',
          }}
        >
          Sign Up
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
          <span style={{ color: theme.colors.textMuted, fontSize: '13px', fontWeight: '500' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: theme.colors.border }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const success = signInWithGoogle(credentialResponse.credential);
                if (success) {
                  navigate('/');
                } else {
                  setError('Google sign-up failed. Please try again.');
                }
              }
            }}
            onError={() => setError('Google sign-up failed. Please try again.')}
            text="signup_with"
            shape="rectangular"
            width={320}
          />
        </div>
        <p style={{ textAlign: 'center', color: theme.colors.textSecondary, fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: theme.colors.primary, fontWeight: '600' }}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
