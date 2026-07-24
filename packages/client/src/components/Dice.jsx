import React from 'react';

const PIP_LAYOUTS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

export default function Dice({ value, canRoll, onRoll }) {
  return (
    <button className="dice" disabled={!canRoll} onClick={onRoll} aria-label="Roll dice">
      {value ? (
        <svg viewBox="0 0 100 100" width="60%" height="60%">
          {PIP_LAYOUTS[value].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="9" fill="#1b1f27" />
          ))}
        </svg>
      ) : (
        '?'
      )}
    </button>
  );
}
