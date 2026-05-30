import React, { useState, useEffect } from 'react';
import { publicApi } from '../services/api';

export default function Timings() {
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getTimings().then(r => setTimings(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <>
      <div className="hero-banner">
        <div className="hero-content">
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
          <div className="hero-text">
            <h2>Temple Timings</h2>
            <div className="hero-ornament" />
            <p>Daily darshan schedule and aarti timings</p>
          </div>
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
        </div>
      </div>

      <div className="content-wrapper">
        <div className="section">
          <div className="section-header"><h2>Weekly Schedule</h2><div className="line" /></div>
          <div className="card" style={{padding: 0, overflow: 'hidden'}}>
            <table className="timing-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Open</th>
                  <th>Close</th>
                  <th>Morning Aarti</th>
                  <th>Evening Aarti</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {timings.map(t => (
                  <tr key={t.id}>
                    <td className="day-name">{t.day}</td>
                    <td>{t.openTime}</td>
                    <td>{t.closeTime}</td>
                    <td className="aarti">{t.morningAartiTime || '-'}</td>
                    <td className="aarti">{t.eveningAartiTime || '-'}</td>
                    <td style={{fontSize:12, color:'#666'}}>{t.specialNote || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
