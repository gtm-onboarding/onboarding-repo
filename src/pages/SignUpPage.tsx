import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

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
    border: '1px solid #E8E6E3',
    borderRadius: '8px',
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    fontSize: '15px',
  };

  const labelStyle = {
    display: 'block',
    color: '#1A1A1A',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
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
          Create Account
        </h1>
        <p style={{ color: '#9A9A9A', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>
          Join us and start shopping
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
        <p style={{ textAlign: 'center', color: '#6B6B6B', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/signin" style={{ color: '#E07A5F', fontWeight: '600' }}>
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
