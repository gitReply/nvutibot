// client-mini-app/src/hooks/useGame.js
import { useState } from 'react';

export default function useGame() {
  const [lastResult, setLastResult] = useState(null);

  async function play(telegramId, wager) {
    const clientSeed = Math.random().toString(36).slice(2);
    const serverSeed = Math.random().toString(36).slice(2);
    const nonce = Date.now();
    const res = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, clientSeed, serverSeed, nonce, wager })
    });
    const data = await res.json();
    setLastResult(data);
  }

  return { play, lastResult };
}
