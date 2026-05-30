import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi, saveTokens } from '../services/api';

const GOOGLE_CLIENT_ID = '322132120457-8tj6djij0pa6o1bpq0a6qm4h2kgo20pr.apps.googleusercontent.com';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  // Initialize Google Sign-In
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'rectangular',
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    setError(''); setLoading(true);
    try {
      const { data } = await authApi.googleLogin(response.credential);
      saveTokens(data.accessToken, data.refreshToken);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      saveTokens(data.accessToken, data.refreshToken);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || err.response?.data?.error || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <img src="/chehar-maa-home.png" alt="Chehar Maa" style={{width:160, height:'auto', objectFit:'contain'}} />
        <h2>Chehar Temple</h2>
        <p className="subtitle">Welcome back, devotee</p>

        {error && <p style={{color:'#B22222', fontSize:13, marginBottom:12}}>{error}</p>}

        {/* Google Sign-In Button */}
        <div ref={googleBtnRef} style={{marginBottom: 16, display:'flex', justifyContent:'center'}} />

        <div className="auth-divider">
          <span>or login with email</span>
        </div>

        <div className="form-group"><input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="form-group"><input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <p style={{marginTop:18, fontSize:13, color:'var(--text-light)'}}>Don't have an account? <Link to="/signup" style={{color:'var(--maroon)', fontWeight:600}}>Sign Up</Link></p>
      </form>
    </div>
  );
}
