const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.post('/trial', billingController.startTrial);
router.post('/webhook', express.raw({ type: 'application/json' }), billingController.billingWebhook);

module.exports = router;
