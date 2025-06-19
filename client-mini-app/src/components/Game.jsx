// client-mini-app/src/components/Game.jsx
import React, { useState } from 'react';
import useGame from '../hooks/useGame';

export default function Game({ userId }) {
  const [wager, setWager] = useState(1);
  const { play, lastResult } = useGame();

  const handlePlay = async () => {
    await play(userId, wager);
  };

  return (
    <div style={{ padding: '8px' }}>
      <div>Ставка: 
        <input
          type="number"
          value={wager}
          min="1"
          onChange={e => setWager(Number(e.target.value))}
          style={{ width: '60px', marginLeft: '4px' }}
        /> ⭐
      </div>
      <button onClick={handlePlay} style={{ marginTop: '8px' }}>
        Играть
      </button>
      {lastResult && (
        <div style={{ marginTop: '8px' }}>
          Выпало: {lastResult.result} ⭐ Выигрыш: {lastResult.won} ⭐
          <div>Hash: {lastResult.hash}</div>
        </div>
      )}
    </div>
  );
}
