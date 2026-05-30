import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, clearTokens } from '../services/api';

export default function Profile() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setEmail(payload.sub || '');
      }
    } catch { navigate('/login'); }
  }, []);

  return (
    <>
      <div className="hero-banner">
        <div className="hero-content">
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
          <div className="hero-text">
            <h2>My Profile</h2>
            <div className="hero-ornament" />
          </div>
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
        </div>
      </div>

      <div className="content-wrapper">
        <div style={{maxWidth: 600, margin: '0 auto'}}>
          <div className="card">
            <div className="section-header"><h2>Account Information</h2><div className="line" /></div>
            <div className="profile-info">
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{email || '-'}</span>
              </div>
            </div>
          </div>

          <button className="btn btn-outline" style={{marginTop: 20}} onClick={() => { clearTokens(); navigate('/login'); }}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}
