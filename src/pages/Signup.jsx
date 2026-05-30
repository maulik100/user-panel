import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';

const BLOCKED_DOMAINS = ['yopmail.com','mailinator.com','guerrillamail.com','tempmail.com','temp-mail.org','throwaway.email','fakeinbox.com','trashmail.com','10minutemail.com','dispostable.com','maildrop.cc','getnada.com','sharklasers.com','guerrillamail.net','mailnesia.com','burnermail.io','grr.la','spam4.me','emailfake.com','tempmailo.com'];

function isDisposableEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && BLOCKED_DOMAINS.includes(domain);
}

function getPasswordErrors(password) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One digit');
  return errors;
}

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('signup'); // signup | otp | success
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(''); setLoading(true);
    try {
      const { data } = await authApi.signup(form);
      setMessage(data.message || 'OTP sent to your email!');
      setStep('otp');
      setResendCooldown(60);
    } catch (err) { setMessage(err.response?.data?.error || err.response?.data?.message || 'Signup failed'); }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setMessage(''); setLoading(true);
    try {
      await authApi.verifyOtp(form.email, otp);
      setStep('success');
    } catch (err) { setMessage(err.response?.data?.error || err.response?.data?.message || 'OTP verification failed'); }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setMessage(''); setLoading(true);
    try {
      const { data } = await authApi.resendOtp(form.email);
      setMessage(data.message || 'OTP resent!');
      setResendCooldown(60);
    } catch (err) { setMessage(err.response?.data?.error || err.response?.data?.message || 'Failed to resend OTP'); }
    setLoading(false);
  };

  // Success popup after OTP verification
  if (step === 'success') {
    return (
      <div className="auth-page">
        <div className="auth-box" style={{textAlign:'center'}}>
          <div style={{fontSize:60, marginBottom:16}}>✅</div>
          <h2 style={{color:'#2E7D32', marginBottom:8}}>Email Verified!</h2>
          <p style={{color:'#555', fontSize:14, marginBottom:24}}>Your account has been verified successfully. You can now login.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  // OTP verification step
  if (step === 'otp') {
    return (
      <div className="auth-page">
        <form className="auth-box" onSubmit={handleVerifyOtp}>
          <img src="/chehar-maa-home.png" alt="Chehar Maa" style={{width:160, height:'auto', objectFit:'contain'}} />
          <h2>Verify Your Email</h2>
          <p className="subtitle">OTP sent to <strong>{form.email}</strong></p>

          {message && <p style={{color: message.toLowerCase().includes('success') || message.toLowerCase().includes('sent') ? '#2E7D32' : '#B22222', fontSize:13, marginBottom:12}}>{message}</p>}

          <div className="form-group">
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => { if (e.target.value.length <= 6) setOtp(e.target.value.replace(/\D/g, '')); }}
              maxLength={6}
              required
              style={{textAlign:'center', fontSize:20, letterSpacing:10, fontWeight:'bold'}}
            />
          </div>

          <button className="btn btn-primary" disabled={loading || otp.length !== 6}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div style={{marginTop:16, textAlign:'center'}}>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading || resendCooldown > 0}
              style={{background:'none', border:'none', color: resendCooldown > 0 ? '#999' : 'var(--maroon)', cursor: resendCooldown > 0 ? 'default' : 'pointer', fontSize:13, fontWeight:600}}
            >
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </div>

          <p style={{marginTop:18, fontSize:13, color:'var(--text-light)'}}>
            <Link to="/login" style={{color:'var(--maroon)', fontWeight:600}}>Back to Login</Link>
          </p>
        </form>
      </div>
    );
  }

  // Signup form
  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <img src="/chehar-maa-home.png" alt="Chehar Maa" style={{width:160, height:'auto', objectFit:'contain'}} />
        <h2>Chehar Temple</h2>
        <p className="subtitle">Create your account</p>

        {message && <p style={{color: message.includes('success') ? '#2E7D32' : '#B22222', fontSize:13, marginBottom:12}}>{message}</p>}

        <div className="form-group"><input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
        <div className="form-group">
          <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          {form.email && isDisposableEmail(form.email) && (
            <p style={{color:'#B22222', fontSize:11, marginTop:4}}>⚠️ Temporary/disposable emails are not allowed. Use Gmail, Outlook, Yahoo, etc.</p>
          )}
        </div>
        <div className="form-group">
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          {form.password && getPasswordErrors(form.password).length > 0 && (
            <p style={{color:'#B22222', fontSize:11, marginTop:4}}>Password needs: {getPasswordErrors(form.password).join(', ')}</p>
          )}
        </div>
        <div className="form-group"><input placeholder="Mobile Number" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} /></div>
        <button className="btn btn-primary" disabled={loading || (form.email && isDisposableEmail(form.email)) || (form.password && getPasswordErrors(form.password).length > 0)}>{loading ? 'Creating...' : 'Sign Up'}</button>
        <p style={{marginTop:18, fontSize:13, color:'var(--text-light)'}}>Already have an account? <Link to="/login" style={{color:'var(--maroon)', fontWeight:600}}>Login</Link></p>
      </form>
    </div>
  );
}
