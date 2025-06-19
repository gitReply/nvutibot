// client-mini-app/src/components/Notifications.jsx
import React from 'react';

export default function Notifications({ notifications }) {
  return (
    <div style={{ padding: '8px' }}>
      {notifications.map(n => (
        <div key={n.id} style={{ marginBottom: '4px' }}>
          {n.text}
        </div>
      ))}
    </div>
  );
}
