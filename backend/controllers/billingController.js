const supabase = require('../config/supabase');
// const Razorpay = require('razorpay');

// Mock Razorpay instance for phase 1
// const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

exports.startTrial = async (req, res) => {
    try {
        // Implementation for starting a trial
        const { plan_id } = req.body;
        
        const { data, error } = await supabase
            .from('subscriptions')
            .insert([{
                org_id: req.org_id,
                plan_id: plan_id || 'trial-plan',
                status: 'active',
                current_period_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
            }])
            .select();

        if (error) throw error;
        
        res.status(200).json({ message: "Trial started", data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.billingWebhook = async (req, res) => {
    try {
        const event = req.body;
        console.log("Razorpay Webhook Event:", event.event);
        // Handle subscription events (e.g., subscription.charged, subscription.halted)
        res.status(200).json({ status: "ok" });
    } catch (error) {
        console.error("Billing Webhook Error:", error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};
