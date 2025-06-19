// client-mini-app/src/components/NickBar.jsx
import React from 'react';

export default function NickBar({ nickname, avatarUrl }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
      <img
        src={avatarUrl}
        alt="avatar"
        style={{ width: '40px', height: '40px', borderRadius: '20px', marginRight: '8px' }}
      />
      <span>{nickname}</span>
    </div>
);
}
