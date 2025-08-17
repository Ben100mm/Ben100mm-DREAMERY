import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainHubPage from './pages/MainHubPage';
import NotificationsPage from './pages/NotificationsPage';
import ListingsPage from './pages/ListingsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHubPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
