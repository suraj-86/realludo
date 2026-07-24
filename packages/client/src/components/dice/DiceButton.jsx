import "./DiceButton.css";
import { motion } from "framer-motion";

export default function DiceButton({
  value,
  canRoll,
  onRoll,
  rolling = false,
}) {
  return (
    <div className="dice-wrapper">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        animate={
          rolling
            ? {
                rotate: [0, 90, 180, 270, 360, 540],
                scale: [1, 1.15, 0.95, 1.1, 0.98, 1],
              }
            : {}
        }
        transition={{ duration: 0.7 }}
        className={`dice ${rolling ? "rolling" : ""} ${
          !canRoll ? "disabled" : ""
        }`}
        disabled={!canRoll}
        onClick={onRoll}
      >
        <span>{value || "🎲"}</span>
      </motion.button>

      <div className="dice-label">
        {canRoll ? "Tap to Roll" : "Wait..."}
      </div>
    </div>
  );
}