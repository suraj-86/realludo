import "./DiceButton.css";
import { motion } from "framer-motion";

const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function DiceButton({
  value = null,
  canRoll = false,
  onRoll,
}) {
  return (
    <motion.button
      whileHover={canRoll ? { scale: 1.08 } : {}}
      whileTap={canRoll ? { scale: 0.94 } : {}}
      className={`dice-button ${canRoll ? "active" : ""}`}
      disabled={!canRoll}
      onClick={onRoll}
    >
      {value ? faces[value - 1] : "🎲"}
    </motion.button>
  );
}