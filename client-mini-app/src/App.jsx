import React, { useEffect, useState } from 'react';
import { initData, MainButton } from 'telegram-web-app';
import NickBar from './components/NickBar';
import Balance from './components/Balance';
import Notifications from './components/Notifications';
import Game from './components/Game';
import useAuth from './hooks/useAuth';
import useNotifications from './hooks/useNotifications';

export default function App() {
  const [tgData, setTgData] = useState(null);
  const { user, setUser } = useAuth();
  const { notifications, fetchNotifications } = useNotifications();

  useEffect(() => {
    const data = initData();
    setTgData(data);
    // регистрация или получение юзера
    fetch('/api/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId: data.user.id,
        nickname: data.user.username,
        avatarUrl: data.user.photo_url
      })
    }).then(r => r.json()).then(setUser);
    fetchNotifications();
  }, []);

  if (!user) return null;

  return (
    <div className="app">
      <NickBar nickname={user.nickname} avatarUrl={user.avatarUrl} />
      <Balance balance={user.balance} bonus={user.bonusBalance} telegramMainButton={MainButton} />
      <Notifications items={notifications} />
      <Game user={user} setUser={setUser} telegramMainButton={MainButton} />
      <footer>
        <small>© 2025, {new Date().toLocaleDateString()}</small>
      </footer>
    </div>
  );
}
