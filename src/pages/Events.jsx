import React, { useState, useEffect } from 'react';
import { publicApi } from '../services/api';

export default function Events() {
  const [data, setData] = useState({ today: [], upcoming: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getEvents().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <>
      <div className="hero-banner">
        <div className="hero-content">
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
          <div className="hero-text">
            <h2>Temple Events</h2>
            <div className="hero-ornament" />
            <p>Stay updated with upcoming festivals, celebrations, and special darshan timings</p>
          </div>
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
        </div>
      </div>

      <div className="content-wrapper">
        {data.today.length > 0 && (
          <div className="section">
            <div className="section-header"><h2>🔴 Today's Events</h2><div className="line" /></div>
            <div className="card" style={{padding: 0, overflow: 'hidden'}}>
              {data.today.map(ev => <EventRow key={ev.id} event={ev} />)}
            </div>
          </div>
        )}

        <div className="section">
          <div className="section-header"><h2>Upcoming Events</h2><div className="line" /></div>
          {data.upcoming.length === 0 ? (
            <p style={{color: '#999'}}>No upcoming events scheduled</p>
          ) : (
            <div className="card" style={{padding: 0, overflow: 'hidden'}}>
              {data.upcoming.map(ev => <EventRow key={ev.id} event={ev} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function EventRow({ event }) {
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const day = event.eventDate ? event.eventDate.slice(-2) : '--';
  const month = event.eventDate ? months[parseInt(event.eventDate.split('-')[1]) - 1] : '';

  return (
    <div className="event-item">
      <div className="event-date-box">
        <div className="day">{day}</div>
        <div className="month">{month}</div>
      </div>
      <div className="event-details">
        <h4>{event.title}</h4>
        {event.description && <p>{event.description.substring(0, 100)}</p>}
        <span className="event-badge">{event.allDayEvent ? 'All Day Event' : `${event.startTime || ''} - ${event.endTime || ''}`}</span>
      </div>
    </div>
  );
}
