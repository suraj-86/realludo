import React from "react";

export default function CenterGoal() {
  return (
    <>
      <defs>
        <linearGradient id="centerRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ef5350" />
          <stop offset="100%" stopColor="#d32f2f" />
        </linearGradient>

        <linearGradient id="centerGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#43a047" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>

        <linearGradient id="centerYellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdd835" />
          <stop offset="100%" stopColor="#f9a825" />
        </linearGradient>

        <linearGradient id="centerBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="100%" stopColor="#1565c0" />
        </linearGradient>
      </defs>

      {/* Red */}
      <polygon
        points="7,7 6,6 7,6"
        fill="url(#centerRed)"
      />

      {/* Green */}
      <polygon
        points="7,7 8,6 8,7"
        fill="url(#centerGreen)"
      />

      {/* Yellow */}
      <polygon
        points="7,7 8,8 7,8"
        fill="url(#centerYellow)"
      />

      {/* Blue */}
      <polygon
        points="7,7 6,8 6,7"
        fill="url(#centerBlue)"
      />

      {/* Border */}
      <circle
        cx="7"
        cy="7"
        r="0.18"
        fill="#ffffff"
        stroke="#d9d9d9"
        strokeWidth="0.03"
      />
    </>
  );
}