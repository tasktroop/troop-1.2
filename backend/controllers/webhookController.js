const supabase = require('../config/supabase');

exports.twilioWebhook = async (req, res) => {
    try {
        const { CallSid, RecordingUrl, TranscriptionText, From, To } = req.body;
        // Logic to match lead based on 'From' or 'To' phone number and storing in call_logs would go here
        console.log(`Twilio Webhook - CallSid: ${CallSid}`);
        
        res.status(200).send('<Response></Response>'); 
    } catch (error) {
        console.error("Twilio Webhook Error:", error);
        res.status(500).send('Webhook Error');
    }
};

exports.voiceflowWebhook = async (req, res) => {
    try {
        const payload = req.body;
        console.log("Voiceflow Webhook received payload:", payload);
        res.status(200).json({ status: 'received' });
    } catch (error) {
        console.error("Voiceflow Webhook Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.whatsappWebhook = async (req, res) => {
    try {
        const payload = req.body;
        console.log("WhatsApp Webhook received payload:", payload);
        res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
        console.error("WhatsApp Webhook Error:", error);
        res.sendStatus(500);
    }
};
