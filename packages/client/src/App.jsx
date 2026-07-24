import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LocalGame from "./pages/LocalGame";
import OnlineRoom from "./pages/OnlineRoom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/local/:mode" element={<LocalGame />} />
      <Route path="/room/:roomId" element={<OnlineRoom />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}