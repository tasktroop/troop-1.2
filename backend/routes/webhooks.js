const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/twilio', webhookController.twilioWebhook);
router.post('/voiceflow', webhookController.voiceflowWebhook);
router.post('/whatsapp', webhookController.whatsappWebhook);

module.exports = router;
