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
    <main className="game-layout">
      <section className="top-row">
        <div className="player-area">
          {topLeft}
        </div>

        <div className="player-area">
          {topRight}
        </div>
      </section>

      <section className="board-area">
        {board}
      </section>

      <section className="bottom-row">
        <div className="player-area">
          {bottomLeft}
        </div>

        <div className="player-area">
          {bottomRight}
        </div>
      </section>

      <section className="status-area">
        {status}
      </section>
    </main>
  );
}