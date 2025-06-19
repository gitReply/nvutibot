import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';

export default function Referrals() {
  const [refs, setRefs] = useState([]);
  const [form, setForm] = useState({ code: '', referrerId: '', bonusAmount: 0 });

  useEffect(() => {
    axios.get('/api/referrals')
      .then(res => setRefs(res.data))
      .catch(console.error);
  }, []);

  const create = () => {
    axios.post('/api/referral/custom', form)
      .then(res => setRefs([...refs, res.data]))
      .catch(console.error);
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1>Реферальные ссылки</h1>
      <Table data={refs} columns={['id', 'code', 'referrerId', 'bonusAmount', 'isCustom']} />
      <h2>Создать кастомную ссылку</h2>
      <div>
        <label>Код: <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} /></label>
      </div>
      <div>
        <label>ID реферера: <input type="number" value={form.referrerId} onChange={e => setForm({...form, referrerId: Number(e.target.value)})} /></label>
      </div>
      <div>
        <label>Бонус: <input type="number" value={form.bonusAmount} onChange={e => setForm({...form, bonusAmount: Number(e.target.value)})} /></label>
      </div>
      <button onClick={create}>Создать</button>
    </div>
)}
