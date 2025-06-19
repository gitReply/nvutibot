const express = require('express');
const userCtrl = require('../controllers/userController');
const gameCtrl = require('../controllers/gameController');
const referralCtrl = require('../controllers/referralController');
const notificationCtrl = require('../controllers/notificationController');
const settingsCtrl = require('../controllers/settingsController');

const router = express.Router();

router.post('/me', userCtrl.me);
router.post('/credit', userCtrl.credit);
router.post('/bonus', userCtrl.setBonus);

router.post('/game', gameCtrl.play);

router.post('/referral/apply', referralCtrl.apply);
router.post('/referral/credit', referralCtrl.credit);
router.post('/referral/custom', referralCtrl.createCustom);

router.get('/notifications', notificationCtrl.list);
router.post('/notifications', notificationCtrl.create);
router.put('/notifications', notificationCtrl.update);
router.delete('/notifications', notificationCtrl.remove);

router.get('/settings', settingsCtrl.get);
router.put('/settings', settingsCtrl.update);

module.exports = router;
