import React from 'react';

export default function Chart({ data }) {
  // Простой текстовый вывод
  return (
    <div>
      <h2>Игры по дням</h2>
      <ul>
        {data?.map(d => (
          <li key={d.date}>{d.date}: {d.count}</li>
        ))}
      </ul>
    </div>
  );
}
