const { applyReferral, creditReferral, createCustomReferral } = require('../services/referralService');

async function apply(req, res) {
  const { userId, code } = req.body;
  if (!userId || !code) return res.status(400).json({ error: 'Invalid parameters' });
  try {
    await applyReferral(userId, code);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function credit(req, res) {
  const { code, amount } = req.body;
  if (!code || typeof amount !== 'number') return res.status(400).json({ error: 'Invalid parameters' });
  try {
    const bonus = await creditReferral(code, amount);
    res.json({ bonus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createCustom(req, res) {
  const { code, referrerId, bonusAmount } = req.body;
  if (!code || !referrerId || typeof bonusAmount !== 'number') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }
  try {
    const ref = await createCustomReferral(code, referrerId, bonusAmount);
    res.json(ref);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { apply, credit, createCustom };
