const { getSettings, updateSettings } = require('../services/settingsService');

async function get(req, res) {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  const fields = req.body;
  try {
    const settings = await updateSettings(fields);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { get, update };
