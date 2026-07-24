import "./GameLayout.css";

export default function GameLayout({
  topLeft,
  topRight,
  board,
  bottomLeft,
  bottomRight,
  status,
}) {
  return (
    <div className="game-layout">
      <div className="top-row">
        <div className="player-area">{topLeft}</div>
        <div className="player-area">{topRight}</div>
      </div>

      <div className="board-area">
        {board}
      </div>

      <div className="bottom-row">
        <div className="player-area">{bottomLeft}</div>
        <div className="player-area">{bottomRight}</div>
      </div>

      <div className="status-area">
        {status}
      </div>
    </div>
  );
}