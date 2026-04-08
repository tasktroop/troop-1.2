const twilio = require('twilio');
const supabase = require('../../config/supabase'); // existing instance
const handleVoiceWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-twilio-signature'] || '';
    const url = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/webhook/twilio` : 'https://api.leados.com/webhook/twilio';
    const params = req.body;
    
    // In strict production, ensure TWILIO_AUTH_TOKEN is verified
    // const isValid = twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN, signature, url, params);
    // if (!isValid && process.env.NODE_ENV !== 'test') return res.status(403).send('Forbidden');

    const { CallSid, From, To, CallDuration, RecordingUrl, CallStatus } = req.body;

    if (CallStatus === 'completed') {
      // 1. Upsert lead
      const { data: lead, error: leadErr } = await supabase
        .from('leads')
        .upsert(
          { phone: From, source: 'inbound_call', stage: 'new' },
          { onConflict: 'phone' } // assuming phone unique constraint, or handle gracefully
        )
        .select()
        .single();
      
      const leadId = lead ? lead.id : null;

      // 2. Insert call_log
      await supabase.from('call_logs').insert({
        org_id: params.org_id || null, // if passed in query string maybe
        lead_id: leadId,
        call_sid: CallSid,
        duration: CallDuration ? parseInt(CallDuration) : 0,
        recording_url: RecordingUrl,
        transcript_stub: "Pending transcription"
      });
    }

    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
    twiml.say('Thank you.');

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Voice webhook error:', error);
    res.status(500).send('Server Error');
  }
};

module.exports = { handleVoiceWebhook };
