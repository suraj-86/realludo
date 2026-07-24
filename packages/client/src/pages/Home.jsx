import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ensureConnected, socket } from '../net/socket.js';

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const createOnlineRoom = () => {
    setCreating(true);
    ensureConnected();
    socket.emit('create-room', { name: name || undefined }, (res) => {
      setCreating(false);
      if (!res?.ok) return alert(res?.error || 'Could not create room');
      sessionStorage.setItem(
        `ludo-room-${res.roomId}`,
        JSON.stringify({ playerId: res.playerId, color: res.color })
      );
      navigate(`/room/${res.roomId}`);
    });
  };

  return (
    <div className="page">
      <h1 className="title">🎲 Ludo</h1>
      <p className="subtitle">No sign-up. Pick a mode and play.</p>

      <button className="btn primary" onClick={() => navigate('/local/pass')}>
        Pass &amp; Play (same device)
      </button>
      <button className="btn primary" onClick={() => navigate('/local/bot')}>
        Vs Bot
      </button>

      <div className="card">
        <p className="subtitle" style={{ margin: '0 0 10px' }}>
          Play online with friends — share a link, no account needed.
        </p>
        <div className="row" style={{ marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
        </div>
        <button className="btn primary" onClick={createOnlineRoom} disabled={creating}>
          {creating ? 'Creating room…' : 'Create Online Room'}
        </button>
      </div>
    </div>
  );
}
