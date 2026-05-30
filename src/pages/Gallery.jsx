import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicApi, isLoggedIn } from '../services/api';

export default function Gallery() {
  const [tab, setTab] = useState('reels');
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return (
      <>
        <div className="hero-banner">
          <div className="hero-content">
            <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
            <div className="hero-text">
              <h2>Gallery</h2>
              <div className="hero-ornament" />
              <p>Watch temple reels and browse photo album</p>
            </div>
            <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
          </div>
        </div>
        <div style={{textAlign:'center', padding:'60px 24px'}}>
          <div style={{fontSize:48, marginBottom:16}}>🔒</div>
          <h3 style={{color:'var(--maroon)', marginBottom:8}}>Login Required</h3>
          <p style={{color:'#666', marginBottom:24}}>Please login to access the gallery and watch temple reels.</p>
          <button className="btn btn-primary" style={{width:'auto', padding:'12px 36px'}} onClick={() => navigate('/login')}>
            Login to Continue
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hero-banner">
        <div className="hero-content">
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
          <div className="hero-text">
            <h2>Gallery</h2>
            <div className="hero-ornament" />
            <p>Watch temple reels and browse photo album</p>
          </div>
          <img src="/chehar-maa.png" alt="Chehar Maa" className="hero-deity-img" />
        </div>
      </div>

      <div className="gallery-tabs">
        <button className={tab === 'reels' ? 'active' : ''} onClick={() => setTab('reels')}>🎞️ Reels</button>
        <button className={tab === 'album' ? 'active' : ''} onClick={() => setTab('album')}>📸 Album</button>
      </div>

      {tab === 'reels' ? <ReelsTab /> : <AlbumTab />}
    </>
  );
}

function ReelsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadReels = (p) => {
    const setter = p === 0 ? setLoading : setLoadingMore;
    setter(true);
    publicApi.getInstagramReels(p, 9).then(r => {
      const data = r.data.data || r.data;
      const newItems = data.items || [];
      setItems(prev => p === 0 ? newItems : [...prev, ...newItems]);
      setHasNext(data.hasNext || false);
      setPage(p);
      setter(false);
    }).catch(() => setter(false));
  };

  useEffect(() => { loadReels(0); }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (items.length === 0) return <div style={{textAlign:'center', padding:60, color:'#999'}}>No reels available</div>;

  return (
    <div className="reels-grid-wrapper">
      <div className="reels-grid">
        {items.map(item => (
          <div className="reel-card" key={item.id}>
            <ReelPlayer url={item.mediaUrl} />
            <div className="reel-card-title">{item.caption ? item.caption.substring(0, 60) : 'Reel'}</div>
          </div>
        ))}
      </div>
      {hasNext && (
        <div style={{textAlign:'center', padding: 24}}>
          <button className="btn btn-outline" style={{width:'auto', padding:'10px 32px'}} onClick={() => loadReels(page + 1)} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More Reels'}
          </button>
        </div>
      )}
    </div>
  );
}

function ReelPlayer({ url }) {
  const videoRef = React.useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="reel-video" style={{position:'relative', cursor:'pointer'}} onClick={togglePlay}>
      <video
        ref={videoRef}
        src={url}
        muted={muted}
        autoPlay
        loop
        playsInline
        preload="metadata"
        style={{width:'100%', height:'100%', objectFit:'cover'}}
      />
      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        style={{position:'absolute', bottom:12, right:12, background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16}}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      {/* Pause indicator */}
      {!playing && (
        <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.5)', borderRadius:'50%', width:60, height:60, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <span style={{color:'#fff', fontSize:28}}>▶</span>
        </div>
      )}
    </div>
  );
}

function AlbumTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadImages = (p) => {
    const setter = p === 0 ? setLoading : setLoadingMore;
    setter(true);
    publicApi.getInstagramImages(p, 12).then(r => {
      const data = r.data.data || r.data;
      const newItems = data.items || [];
      setItems(prev => p === 0 ? newItems : [...prev, ...newItems]);
      setHasNext(data.hasNext || false);
      setPage(p);
      setter(false);
    }).catch(() => setter(false));
  };

  useEffect(() => { loadImages(0); }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (items.length === 0) return <div style={{textAlign:'center', padding:60, color:'#999'}}>No photos available</div>;

  return (
    <>
      <div className="album-grid">
        {items.map(item => (
          <div className="album-item" key={item.id} onClick={() => setPreview(item)}>
            <img src={item.mediaUrl} alt={item.caption || 'Photo'} loading="lazy" />
            <p>{item.caption ? item.caption.substring(0, 50) : ''}</p>
          </div>
        ))}
      </div>

      {hasNext && (
        <div style={{textAlign:'center', padding: 24}}>
          <button className="btn btn-outline" style={{width:'auto', padding:'10px 32px'}} onClick={() => loadImages(page + 1)} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load More Photos'}
          </button>
        </div>
      )}

      {/* Image Preview Modal */}
      {preview && (
        <div className="image-modal-overlay" onClick={() => setPreview(null)}>
          <div className="image-modal" onClick={e => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setPreview(null)}>&times;</button>
            <img src={preview.mediaUrl} alt={preview.caption || 'Photo'} />
            {preview.caption && <div className="image-modal-caption">{preview.caption}</div>}
          </div>
        </div>
      )}
    </>
  );
}
