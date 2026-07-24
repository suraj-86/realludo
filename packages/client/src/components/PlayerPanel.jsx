import React from 'react';

export default function PlayerPanel({ players, turnIndex, myColor }) {
  return (
    <div className="player-panel">
      {players.map((p, i) => (
        <div key={p.color} className={`player-chip${i === turnIndex ? ' active' : ''}`}>
          <span className={`dot ${p.color}`} />
          {p.name}
          {p.color === myColor ? ' (you)' : ''}
          {p.isBot ? ' 🤖' : ''}
        </div>
      ))}
    </div>
  );
}
