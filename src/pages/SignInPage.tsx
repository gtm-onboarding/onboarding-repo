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
    border: '1px solid #E8E6E3',
    borderRadius: '8px',
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    fontSize: '15px',
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '80px 24px' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08)',
          padding: '48px',
          borderRadius: '20px',
          maxWidth: '420px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            color: '#1A1A1A',
            marginBottom: '8px',
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: '600',
          }}
        >
          Welcome Back
        </h1>
        <p style={{ color: '#9A9A9A', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>
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
              color: '#1A1A1A',
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
              color: '#1A1A1A',
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
            backgroundColor: '#E07A5F',
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
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E6E3' }} />
          <span style={{ color: '#9A9A9A', fontSize: '13px', fontWeight: '500' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E6E3' }} />
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
        <p style={{ textAlign: 'center', color: '#6B6B6B', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#E07A5F', fontWeight: '600' }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
