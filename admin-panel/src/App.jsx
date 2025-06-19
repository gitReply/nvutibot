import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Referrals from './pages/Referrals';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '8px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Дашборд</Link> | <Link to="/users">Пользователи</Link> | <Link to="/settings">Настройки</Link> | <Link to="/referrals">Рефералы</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/referrals" element={<Referrals />} />
      </Routes>
    </BrowserRouter>
  );
}
