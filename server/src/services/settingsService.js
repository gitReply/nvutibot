const { Settings } = require('../models/init');

async function getSettings() {
  let settings = await Settings.findByPk(1);
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

async function updateSettings(fields) {
  const settings = await getSettings();
  return settings.update(fields);
}

module.exports = {
  getSettings,
  updateSettings
};
