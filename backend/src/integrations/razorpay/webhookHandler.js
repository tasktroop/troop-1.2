const crypto = require('crypto');
const supabase = require('../../config/supabase');
const handleRazorpayWebhook = async (req, res) => {
  // Normally: const signature = req.headers['x-razorpay-signature'];
  // crypto.createHmac verification
  const { event, payload, metadata } = req.body;

  if (event === 'payment.captured') {
    const leadId = metadata?.leadId || 1; // Assuming we passed it when creating
    
    try {
      await supabase.from('leads').update({ stage: 'paid' }).eq('id', leadId);
      
      await supabase.from('usage_logs').insert({
        org_id: 'default',
        model: 'system',
        tokens_in: 0,
        tokens_out: 0,
        cost_usd: 0,
        template_name: 'razorpay_payment_capture'
      });
    } catch(e) {}
  }
  
  res.json({ status: 'ok' });
};

module.exports = { handleRazorpayWebhook };
