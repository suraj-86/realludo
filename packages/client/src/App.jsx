import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import LocalGame from './pages/LocalGame.jsx';
import OnlineRoom from './pages/OnlineRoom.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/local/:mode" element={<LocalGame />} />
      <Route path="/room/:roomId" element={<OnlineRoom />} />
    </Routes>
  );
}
