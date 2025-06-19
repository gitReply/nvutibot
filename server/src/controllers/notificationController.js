const { getActiveNotifications, createNotification, updateNotification, deleteNotification } = require('../services/notificationService');

async function list(req, res) {
  try {
    const items = await getActiveNotifications();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Invalid parameters' });
  try {
    const notif = await createNotification(text);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  const { id, fields } = req.body;
  if (!id || !fields) return res.status(400).json({ error: 'Invalid parameters' });
  try {
    const notif = await updateNotification(id, fields);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Invalid parameters' });
  try {
    await deleteNotification(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { list, create, update, remove };
