// client-mini-app/src/hooks/useNotifications.js
import { useState } from 'react';

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  async function fetchNotifications() {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data);
  }
  return { notifications, fetchNotifications };
}
