import "./PlayerCard.css";

export default function PlayerCard({
  player,
  active = false,
  dice = null,
  canRoll = false,
  onRoll,
}) {
  if (!player) {
    return (
      <div className="player-card empty">
        <div className="player-status">Empty Slot</div>
      </div>
    );
  }

  return (
    <div className={`player-card ${active ? "active" : ""}`}>
      <div className="player-header">
        <div className={`player-color ${player.color}`} />

        <div>
          <h3>{player.name}</h3>

          <p className="player-type">
            {player.isBot ? "Bot" : "Human"}
          </p>
        </div>
      </div>

      <div className="player-center">
        {canRoll ? (
          <button
            className="dice-button"
            onClick={onRoll}
          >
            🎲
          </button>
        ) : (
          <div className="dice-preview">
            {dice ?? "—"}
          </div>
        )}
      </div>

      <div className="player-status">
        {active ? "Your Turn" : "Waiting..."}
      </div>
    </div>
  );
}