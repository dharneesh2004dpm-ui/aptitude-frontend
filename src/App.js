import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import TestPage from './TestPage';
import Leaderboard from './Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This line fixes the blank screen by making the Admin panel the homepage */}
        <Route path="/" element={<AdminDashboard />} />
        
        <Route path="/test/:testId" element={<TestPage />} />
        <Route path="/leaderboard/:testId" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;