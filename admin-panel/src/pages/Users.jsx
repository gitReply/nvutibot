import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: '16px' }}>
      <h1>Пользователи</h1>
      <Table data={users} columns={['id', 'telegramId', 'nickname', 'balance', 'bonusBalance']} />
    </div>
  );
}
