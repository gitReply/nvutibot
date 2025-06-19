const express = require('express');
const { stats, listUsers, payoutUser } = require('../controllers/adminController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(auth);

router.get('/stats', stats);
router.get('/users', listUsers);
router.post('/payout', payoutUser);

module.exports = router;
