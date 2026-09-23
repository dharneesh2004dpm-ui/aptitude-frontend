import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import TestPage from './TestPage';
import Leaderboard from './Leaderboard';
import PracticeDashboard from './PracticeDashboard';
import PracticeSession from './PracticeSession';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/test/:testId" element={<TestPage />} />
        <Route path="/leaderboard/:testId" element={<Leaderboard />} />
        
        <Route path="/practice" element={<PracticeDashboard />} />
        <Route path="/practice/:topic" element={<PracticeSession />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;