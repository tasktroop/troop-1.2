const express = require('express');
const { sendFollowUp, sendPaymentReminder } = require('../integrations/whatsapp/outbound');
const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { leadId, type } = req.body;
    let paymentLink = null;
    
    if (type === 'payment') {
      // Stub payment link passing if not present
      paymentLink = req.body.paymentLink || 'https://buy.stripe.com/mock';
      await sendPaymentReminder(leadId, paymentLink);
    } else {
      await sendFollowUp(leadId);
    }
    
    res.json({ success: true, message: `Dispatched ${type} via WhatsApp` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
