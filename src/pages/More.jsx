import React, { useState, useEffect } from 'react';
import { publicApi } from '../services/api';

export default function More() {
  const [social, setSocial] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      publicApi.getSocialMedia().then(r => setSocial(r.data)).catch(() => {}),
      publicApi.getContactInfo().then(r => setContact(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <>
      <div className="hero-banner">
        <div className="hero-content">
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
          <div className="hero-text">
            <h2>About Chehar Temple</h2>
            <div className="hero-ornament" />
            <p>A sacred place of worship dedicated to Chehar Maa</p>
          </div>
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
        </div>
      </div>

      <div className="content-wrapper">
        <div className="content-grid">
          <div className="content-main">
            <div className="section">
              <div className="section-header"><h2>Our Temple</h2><div className="line" /></div>
              <div className="card">
                <p style={{fontSize:15, lineHeight:1.8, color:'#444'}}>
                  Chehar Temple is a sacred place of worship dedicated to Chehar Maa. The temple serves as a spiritual center for devotees seeking blessings, peace, and divine grace.
                  <br /><br />
                  The temple has been serving the community for generations, providing a place for prayer, meditation, and spiritual growth. We welcome all devotees to experience the divine presence of Chehar Maa.
                  <br /><br />
                  Our temple conducts daily aarti, special pujas during festivals, and community events throughout the year. We are committed to preserving our cultural heritage while serving the spiritual needs of our community.
                </p>
              </div>
            </div>

            <div className="section">
              <div className="section-header"><h2>Contact Information</h2><div className="line" /></div>
              <div className="card">
                <p style={{fontSize:14, lineHeight:2, color:'#555'}}>
                  📍 <strong>Address:</strong> {contact?.address || 'Chehar Temple, Gujarat, India'}<br />
                  📧 <strong>Email:</strong> {contact?.email || 'info@chehartemple.com'}<br />
                  📞 <strong>Phone:</strong> {contact?.phone || '+91-XXXXX-XXXXX'}<br />
                  🕐 <strong>Office Hours:</strong> 9:00 AM - 6:00 PM (Mon-Sat)
                </p>
              </div>
            </div>
          </div>

          <div className="content-sidebar">
            <div className="widget">
              <div className="widget-header">🔗 Connect With Us</div>
              <div className="widget-body">
                {social && (
                  <div className="social-links">
                    <a href={social.facebook} target="_blank" rel="noreferrer" className="social-link fb">📘 Facebook Page</a>
                    <a href={social.instagram} target="_blank" rel="noreferrer" className="social-link ig">📷 Instagram</a>
                    <a href={social.youtube} target="_blank" rel="noreferrer" className="social-link yt">▶️ YouTube Channel</a>
                  </div>
                )}
              </div>
            </div>

            <div className="widget">
              <div className="widget-header">🙏 Temple Motto</div>
              <div className="widget-body">
                <p style={{fontStyle:'italic', textAlign:'center', color:'#800000', fontFamily:'Lora, serif'}}>
                  "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                </p>
                <p style={{textAlign:'center', fontSize:12, marginTop:8}}>May all be happy, may all be free from illness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
