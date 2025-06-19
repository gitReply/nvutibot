import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from '../components/Chart';

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get('/api/stats')
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '16px' }}>
      <h1>Дашборд</h1>
      <div>
        <p>Всего пользователей: {stats.usersCount}</p>
        <p>Всего игр: {stats.gamesCount}</p>
        <p>Общий баланс: {stats.totalBalance} ⭐</p>
      </div>
      <Chart data={stats.gamesPerDay} />
    </div>
  );
}
