const twilio = require('twilio');
const supabase = require('../../config/supabase');
const llmRouter = require('../../llm/llmRouter');

const getTwilioClient = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

const sendWhatsApp = async (to, body) => {
  const client = getTwilioClient();
  if (!client) {
    console.warn(`[MOCK TWILIO OUTBOUND] Sending to whatsapp:${to}: ${body}`);
    return;
  }
  await client.messages.create({
    body,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
    to: `whatsapp:${to}`
  });
};

const sendFollowUp = async (leadId) => {
  const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
  if (lead && lead.whatsapp_opted_out) {
    console.log(`Lead ${leadId} opted out of WhatsApp. Skipping follow-up.`);
    return;
  }
  // Safe default variable passing
  const aiResponse = await llmRouter.generate({
    templateName: "lead_followup_whatsapp",
    variables: { 
      lead_name: lead ? lead.name : 'Valued Customer', 
      agent_name: 'Agent', 
      company: 'Our Company', 
      product: 'Solution' 
    },
    orgId: lead ? lead.org_id : 'default'
  });
  if (!aiResponse.flagged && lead) {
    await sendWhatsApp(lead.phone, aiResponse.text);
  }
};

const sendPaymentReminder = async (leadId, paymentLink) => {
  const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();
  if (lead && lead.whatsapp_opted_out) {
    console.log(`Lead ${leadId} opted out of WhatsApp. Skipping payment reminder.`);
    return;
  }
  const aiResponse = await llmRouter.generate({
    templateName: "payment_reminder_whatsapp",
    variables: { 
      lead_name: lead ? lead.name : 'Customer', 
      amount: '$500', 
      due_date: 'tomorrow', 
      payment_link: paymentLink 
    },
    orgId: lead ? lead.org_id : 'default'
  });
  if (!aiResponse.flagged && lead) {
    await sendWhatsApp(lead.phone, aiResponse.text);
  }
};

module.exports = { sendFollowUp, sendPaymentReminder };
