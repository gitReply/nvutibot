// client-mini-app/src/App.jsx (полный)
import React, { useEffect, useState } from 'react';
import { initData } from 'telegram-web-app';
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
    fetch('/api/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegramId: data.user.id,
        nickname: data.user.username,
        avatarUrl: data.user.photo_url
      })
    })
      .then(r => r.json())
      .then(setUser);
    fetchNotifications();
  }, []);

  if (!user) return null;

  return (
    <div>
      <NickBar nickname={user.nickname} avatarUrl={user.avatarUrl} />
      <Balance balance={user.balance} bonus={user.bonusBalance} />
      <Notifications notifications={notifications} />
      <Game userId={user.telegramId} />
      <footer style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px' }}>
        © Comet Casino, 19.06.2025
      </footer>
    </div>
  );
}
