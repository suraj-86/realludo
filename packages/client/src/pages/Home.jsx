import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          width: "min(560px,100%)",
          padding: "48px",
          textAlign: "center",
        }}
      >
        <motion.h1
          className="title"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          LUDO
        </motion.h1>

        <p
          className="subtitle"
          style={{
            marginTop: 18,
            marginBottom: 40,
          }}
        >
          Beautiful local and online multiplayer powered by a shared game
          engine.
        </p>

        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          <button
            className="card"
            style={{
              padding: "20px",
              fontSize: "1.05rem",
              fontWeight: 700,
            }}
            onClick={() => navigate("/local/pass")}
          >
            🎮 Local Multiplayer
          </button>

          <button
            className="card"
            style={{
              padding: "20px",
              fontSize: "1.05rem",
              fontWeight: 700,
            }}
            onClick={() => navigate("/local/bot")}
          >
            🤖 Play vs Bots
          </button>

          <button
            className="card"
            style={{
              padding: "20px",
              fontSize: "1.05rem",
              fontWeight: 700,
            }}
            onClick={() => {
              const room = crypto.randomUUID().slice(0, 6).toUpperCase();
              navigate(`/room/${room}`);
            }}
          >
            🌐 Online Game
          </button>
        </div>
      </motion.div>
    </div>
  );
}