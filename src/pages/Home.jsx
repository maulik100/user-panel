import React, { useState, useEffect, useRef } from 'react';
import { publicApi } from '../services/api';

export default function Home() {
  const [streamUrl, setStreamUrl] = useState('');
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sponsorModal, setSponsorModal] = useState(null);
  const sponsorTimer = useRef(null);
  const [sponsorIdx, setSponsorIdx] = useState(0);

  useEffect(() => {
    Promise.all([
      publicApi.getLiveStream().then(r => setStreamUrl(r.data.url)),
      publicApi.getEvents().then(r => setEvents([...(r.data.today || []), ...(r.data.upcoming || [])].slice(0, 6))),
      publicApi.getNews().then(r => setNews(r.data.slice(0, 5))),
      publicApi.getActiveSponsors().then(r => setSponsors(r.data.data || [])).catch(() => {}),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (sponsors.length > 1) {
      sponsorTimer.current = setInterval(() => {
        setSponsorIdx(i => (i + 1) % sponsors.length);
      }, 15000);
    }
    return () => clearInterval(sponsorTimer.current);
  }, [sponsors]);

  const openSponsorModal = (sponsor) => {
    setSponsorModal(sponsor);
    publicApi.recordSponsorClick(sponsor.id).catch(() => {});
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
          <div className="hero-text">
            <h2>Jai Shree Chehar Maa</h2>
            <div className="hero-ornament" />
            <p>Welcome to the official portal of Shree Chehar Temple. Experience live darshan, stay updated with events, and connect with the divine.</p>
          </div>
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
        </div>
      </div>

      {/* Content */}
      <div className="content-wrapper">
        <div className="content-grid">
          {/* Main Content */}
          <div className="content-main">
            {/* Live Darshan */}
            <div className="section">
              <div className="section-header">
                <h2>📺 Live Darshan</h2>
                <div className="line" />
              </div>
              {streamUrl ? (
                <div className="video-section">
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden' }}>
                    <iframe
                      src={streamUrl}
                      title="Live Darshan"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '40px 20px', background: 'linear-gradient(135deg, #fff8f0, #fff3e0)',
                  borderRadius: 12, border: '2px dashed #e8a87c', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🙏</div>
                  <h3 style={{ color: '#800000', margin: '0 0 8px', fontSize: 20 }}>Live Darshan — Coming Soon</h3>
                  <p style={{ color: '#888', fontSize: 14, margin: '0 0 16px', maxWidth: 340, lineHeight: 1.6 }}>
                    Live darshan streaming will be available soon. Please visit during aarti timings or check back later.
                  </p>
                  <span style={{
                    background: '#800000', color: '#fff', padding: '6px 18px',
                    borderRadius: 20, fontSize: 13, fontWeight: 600
                  }}>🔔 Stay Tuned</span>
                </div>
              )}
            </div>

            {/* Sponsors */}
            {sponsors.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <h2>🤝 Sponsored By</h2>
                  <div className="line" />
                </div>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12, cursor: 'pointer' }}
                  onClick={() => openSponsorModal(sponsors[sponsorIdx])}>
                  {sponsors[sponsorIdx].mediaType === 'IMAGE' ? (
                    <img
                      src={sponsors[sponsorIdx].mediaPreviewUrl}
                      alt={sponsors[sponsorIdx].title}
                      style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12, display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{ position: 'relative', paddingBottom: '40%', height: 0, borderRadius: 12, overflow: 'hidden', pointerEvents: 'none' }}>
                      <iframe
                        src={sponsors[sponsorIdx].mediaPreviewUrl}
                        title={sponsors[sponsorIdx].title}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '8px 12px', background: 'linear-gradient(90deg, #f3e5f5, #fff)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                    <strong style={{ fontSize: 13, color: '#6a1b9a' }}>{sponsors[sponsorIdx].title}</strong>
                  </div>
                  {sponsors.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '6px 0' }}>
                      {sponsors.map((_, i) => (
                        <span key={i} onClick={e => { e.stopPropagation(); setSponsorIdx(i); }}
                          style={{ width: i === sponsorIdx ? 16 : 8, height: 8, borderRadius: 4,
                            background: i === sponsorIdx ? '#6a1b9a' : '#ce93d8', cursor: 'pointer', transition: 'width 0.3s' }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events */}
            <div className="section">
              <div className="section-header">
                <h2>📅 Upcoming Events</h2>
                <div className="line" />
              </div>
              <div className="card" style={{padding: 0, overflow: 'hidden'}}>
                {events.length === 0 ? (
                  <p style={{padding: 20, color: '#999'}}>No upcoming events</p>
                ) : (
                  events.map(ev => (
                    <div className="event-item" key={ev.id}>
                      <div className="event-date-box">
                        <div className="day">{ev.eventDate ? ev.eventDate.slice(-2) : '--'}</div>
                        <div className="month">{ev.eventDate ? getMonth(ev.eventDate) : ''}</div>
                      </div>
                      <div className="event-details">
                        <h4>{ev.title}</h4>
                        <p>{ev.description?.substring(0, 80) || ''}</p>
                        <span className="event-badge">{ev.allDayEvent ? 'All Day' : `${ev.startTime || ''} - ${ev.endTime || ''}`}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Temple Location - Google Map */}
            <div className="section">
              <div className="section-header">
                <h2>📍 Temple Location</h2>
                <div className="line" />
              </div>
              <div className="card" style={{padding: 0, overflow: 'hidden'}}>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d72.55!3d23.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e86061f9453f1%3A0x93a66886f212f89b!2sChehar%20Maa%20Temple!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    style={{border: 0}}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Temple Location"
                  />
                </div>
                <div style={{padding: 16}}>
                  <h4 style={{fontSize: 15, marginBottom: 6, color: '#800000'}}>Shree Chehar Maa Temple, Golkuva</h4>
                  <p style={{fontSize: 13, color: '#666', lineHeight: 1.5}}>Gujarat, India</p>
                  <a
                    href="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiYhKT44LiUAxUAAAAAHQAAAAAQBQ..i&rlz=1C1YTUH_enIN1199IN1201&pvq=CgwvZy8xcHczeXJjbjAiGAoSY2hlaGFyIG1hYSBnb2xrdXZhEAIYAw&lqi=ChJjaGVoYXIgbWFhIGdvbGt1dmFIgN3uvuyVgIAIWiAQABABEAIYABgBGAIiEmNoZWhhciBtYWEgZ29sa3V2YZIBDGhpbmR1X3RlbXBsZQ&fvr=1&cs=1&um=1&ie=UTF-8&fb=1&gl=in&sa=X&ftid=0x395e86061f9453f1:0x93a66886f212f89b"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{marginTop: 12, width: 'auto', display: 'inline-flex', padding: '10px 20px', fontSize: 13}}
                  >
                    🗺️ Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="content-sidebar">
            {/* Temple Info Widget */}
            <div className="widget">
              <div className="widget-header">🛕 About Temple</div>
              <div className="widget-body">
                <p>Chehar Temple is a sacred place of worship dedicated to Chehar Maa, serving as a spiritual center for devotees seeking blessings and peace.</p>
              </div>
            </div>

            {/* News Widget */}
            <div className="widget">
              <div className="widget-header">📰 Latest News</div>
              <div className="widget-body">
                {news.map(n => (
                  <div className="news-item" key={n.id}>
                    <h4>{n.title}</h4>
                    <p>{n.content?.substring(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Widget */}
            <div className="widget">
              <div className="widget-header">🔗 Follow Us</div>
              <div className="widget-body">
                <div className="social-links">
                  <a href="#" className="social-link fb">📘 Facebook Page</a>
                  <a href="#" className="social-link ig">📷 Instagram</a>
                  <a href="#" className="social-link yt">▶️ YouTube Channel</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sponsor Modal */}
      {sponsorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
          onClick={() => setSponsorModal(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 480, width: '100%',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#6a1b9a', fontSize: 18 }}>{sponsorModal.title}</h3>
              <button onClick={() => setSponsorModal(null)}
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            {sponsorModal.mediaType === 'IMAGE' ? (
              <img src={sponsorModal.mediaPreviewUrl} alt={sponsorModal.title}
                style={{ width: '100%', borderRadius: 10, maxHeight: 300, objectFit: 'contain', background: '#f5f5f5' }} />
            ) : (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 10, overflow: 'hidden' }}>
                <iframe src={sponsorModal.mediaPreviewUrl} title={sponsorModal.title}
                  frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
              </div>
            )}
            {sponsorModal.description && (
              <p style={{ marginTop: 14, color: '#555', fontSize: 14, lineHeight: 1.6 }}>{sponsorModal.description}</p>
            )}
            {sponsorModal.redirectUrl && (
              <a href={sponsorModal.redirectUrl} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', marginTop: 14, background: '#6a1b9a', color: '#fff',
                  padding: '10px 22px', borderRadius: 24, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                🔗 Visit Sponsor Website
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function getMonth(dateStr) {
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const m = parseInt(dateStr.split('-')[1]) - 1;
  return months[m] || '';
}
