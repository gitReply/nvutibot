const { Notification } = require('../models/init');

async function getActiveNotifications() {
  return Notification.findAll({ where: { isActive: true } });
}

async function createNotification(text) {
  return Notification.create({ text, isActive: true });
}

async function updateNotification(id, fields) {
  const notif = await Notification.findByPk(id);
  if (!notif) throw new Error('Notification not found');
  return notif.update(fields);
}

async function deleteNotification(id) {
  return Notification.destroy({ where: { id } });
}

module.exports = {
  getActiveNotifications,
  createNotification,
  updateNotification,
  deleteNotification
};
