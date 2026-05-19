import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = signIn(email, password);
    if (success) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } else {
      setError('Invalid email or password');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-input-bg)',
    fontSize: '15px',
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-primary)', minHeight: '100vh', padding: '80px 24px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'var(--color-bg-card)',
          boxShadow: '0 8px 24px var(--color-shadow-strong)',
          padding: '48px',
          borderRadius: '20px',
          maxWidth: '420px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: 'var(--color-text-primary)',
            marginBottom: '8px',
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: '600',
          }}
        >
          Welcome Back
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>
          Sign in to continue shopping
        </p>
        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              color: '#C44536',
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
          <label
            style={{
              display: 'block',
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '28px' }}>
          <label
            style={{
              display: 'block',
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: 'var(--color-accent)',
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
          Sign In
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: '500' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const success = signInWithGoogle(credentialResponse.credential);
                if (success) {
                  const redirect = searchParams.get('redirect') || '/';
                  navigate(redirect);
                } else {
                  setError('Google sign-in failed. Please try again.');
                }
              }
            }}
            onError={() => setError('Google sign-in failed. Please try again.')}
            text="signin_with"
            shape="rectangular"
            width={320}
          />
        </div>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-accent)', fontWeight: '600' }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
