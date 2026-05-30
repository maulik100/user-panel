import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { clearTokens, isLoggedIn } from '../services/api';

export default function Layout() {
  const [showMenu, setShowMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const navigate = useNavigate();
  const location = useLocation();

  // Re-check login status on every route change
  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setShowMenu(false);
  }, [location]);

  const handleLogout = () => {
    clearTokens();
    setShowMenu(false);
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="app">
      {/* Top info bar */}
      <div className="top-bar">
        <span>📞 +91-XXXXX-XXXXX | 📧 info@chehartemple.com</span>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div style={{position:'relative', maxWidth:1200, margin:'0 auto'}}>
          <h1>श्री चेहर मंदिर</h1>
          <p>Shree Chehar Temple — Gujarat, India</p>

          {/* User Menu - Always visible */}
          <div className="user-menu-wrapper">
            <button className="user-menu-btn" onClick={() => setShowMenu(!showMenu)}>
              👤
            </button>
            {showMenu && (
              <div className="user-dropdown">
                {loggedIn ? (
                  <>
                    <NavLink to="/profile" onClick={() => setShowMenu(false)}>👤 My Profile</NavLink>
                    <button onClick={handleLogout}>🚪 Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setShowMenu(false); navigate('/login'); }}>🔑 Login</button>
                    <button onClick={() => { setShowMenu(false); navigate('/signup'); }}>📝 Sign Up</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/events">Events</NavLink></li>
          <li><NavLink to="/gallery">Gallery</NavLink></li>
          <li><NavLink to="/timings">Timings</NavLink></li>
          <li><NavLink to="/more">About</NavLink></li>
        </ul>
      </nav>

      {/* Page Content */}
      <Outlet />

      {/* Footer */}
      <footer className="footer">
        <p className="temple-name">श्री चेहर मंदिर — Shree Chehar Temple</p>
        <p>Gujarat, India | © 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
}
