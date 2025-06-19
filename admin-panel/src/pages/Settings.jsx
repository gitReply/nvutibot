import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get('/api/settings')
      .then(res => {
        setSettings(res.data);
        setForm(res.data);
      })
      .catch(console.error);
  }, []);

  const save = () => {
    axios.put('/api/settings', form)
      .then(res => setSettings(res.data))
      .catch(console.error);
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1>Настройки</h1>
      <div>
        <label>Процент выплат: <input type="number" value={form.payoutPercent} onChange={e => setForm({...form, payoutPercent: Number(e.target.value)})} /></label>
      </div>
      <div>
        <label>Процент рефералов: <input type="number" value={form.referralPercent} onChange={e => setForm({...form, referralPercent: Number(e.target.value)})} /></label>
      </div>
      <div>
        <label>Максимум звёзд: <input type="number" value={form.maxStars} onChange={e => setForm({...form, maxStars: Number(e.target.value)})} /></label>
      </div>
      <div>
        <label>Авто‑выплаты: <input type="checkbox" checked={form.autoPayout} onChange={e => setForm({...form, autoPayout: e.target.checked})} /></label>
      </div>
      <button onClick={save}>Сохранить</button>
    </div>
  );
}
