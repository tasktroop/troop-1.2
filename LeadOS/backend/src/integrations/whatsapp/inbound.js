const twilio = require('twilio');
const supabase = require('../../config/supabase');
const llmRouter = require('../../llm/llmRouter');

// We cache a global twilio client instance if env is present
let clientCache = null;
const getTwilioClient = () => {
  if (clientCache) return clientCache;
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  clientCache = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return clientCache;
};

const handleInboundWhatsApp = async (req, res) => {
  const { From, Body, ProfileName } = req.body;
  const signature = req.headers['x-twilio-signature'] || '';
  
  if (!From) return res.status(400).send('Bad Request');

  try {
    const rawPhone = From.replace('whatsapp:', '');
    
    // 1. Check if lead exists
    let { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', rawPhone)
      .single();

    if (!lead) {
      // Create new lead
      const { data: newLead } = await supabase
        .from('leads')
        .insert({ phone: rawPhone, name: ProfileName || 'WhatsApp Lead', source: 'whatsapp_inbound', stage: 'new', whatsapp_opted_out: false })
        .select()
        .single();
      lead = newLead;
    }

    // 2. Check for OPT OUT
    const bodyStr = (Body || '').trim().toLowerCase();
    if (bodyStr === 'stop') {
      await supabase.from('leads').update({ whatsapp_opted_out: true }).eq('id', lead.id);
      await sendWhatsApp(From, "You have been unsubscribed. Reply START to re-subscribe.");
      return res.send('<Response></Response>');
    }

    if (bodyStr === 'start') {
      await supabase.from('leads').update({ whatsapp_opted_out: false }).eq('id', lead.id);
      await sendWhatsApp(From, "You have been re-subscribed.");
      return res.send('<Response></Response>');
    }

    // 3. Generate AI Follow up
    const aiResponse = await llmRouter.generate({
      templateName: "lead_followup_whatsapp",
      variables: { lead_name: lead.name || 'Friend', agent_name: 'AI Agent', company: 'LeadOS', product: 'Our Solution' },
      orgId: lead.org_id
    });

    if (!aiResponse.flagged) {
      await sendWhatsApp(From, aiResponse.text);
    }

    res.send('<Response></Response>');
  } catch (error) {
    console.error('WhatsApp inbound fail:', error);
    res.status(500).send('Error');
  }
};

const sendWhatsApp = async (to, body) => {
  const client = getTwilioClient();
  if (!client) {
    console.warn(`[MOCK TWILIO] Sending to ${to}: ${body}`);
    return;
  }
  await client.messages.create({
    body,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
    to
  });
};

module.exports = { handleInboundWhatsApp };
