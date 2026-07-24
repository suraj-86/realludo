import "./PlayerCard.css";
import DiceButton from "../dice/DiceButton";

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

        <div className="player-info">
          <h3>{player.name}</h3>

          <span className="player-type">
            {player.isBot ? "🤖 Bot" : "👤 Human"}
          </span>
        </div>
      </div>

      <div className="player-center">
        <DiceButton
          value={dice}
          canRoll={canRoll}
          onRoll={onRoll}
        />
      </div>

      <div className="pawn-row">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`pawn ${player.color}`}
          />
        ))}
      </div>

      <div className="player-status">
        {active ? "Your Turn" : "Waiting..."}
      </div>
    </div>
  );
}