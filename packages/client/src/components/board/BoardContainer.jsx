import "./BoardContainer.css";
import { motion } from "framer-motion";

export default function BoardContainer({ children }) {
  return (
    <motion.section
      className="board-shell"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="board-glow" />

      <div className="board-frame">
        <div className="board-inner">
          {children}
        </div>
      </div>
    </motion.section>
  );
}