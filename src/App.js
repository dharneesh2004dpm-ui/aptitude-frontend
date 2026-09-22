import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TestPage from './TestPage';
import Leaderboard from './Leaderboard';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/test/:testId" element={<TestPage />} />
        <Route path="/leaderboard/:testId" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
