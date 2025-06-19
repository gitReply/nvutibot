// client-mini-app/src/components/Balance.jsx
import React from 'react';

export default function Balance({ balance, bonus }) {
  return (
    <div style={{ padding: '8px' }}>
      <div>Основной баланс: {balance} ⭐</div>
      <div>Бонусный баланс: {bonus} ⭐</div>
      <button onClick={() => alert('Пополнение пока не реализовано')}>Пополнить</button>
    </div>
  );
}
