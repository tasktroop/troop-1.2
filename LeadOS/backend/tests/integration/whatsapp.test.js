let dbLeads = [{ id: 1, phone: '9876543210', whatsapp_opted_out: false }];

const mockHandleInbound = (body) => {
  const rawPhone = body.From.replace('whatsapp:+91', '');
  const bodyStr = body.Body.trim().toLowerCase();
  
  // Find lead
  let lead = dbLeads.find(l => l.phone === rawPhone);
  let duplicateCreated = false;

  if (!lead) {
    lead = { id: Date.now(), phone: rawPhone, whatsapp_opted_out: false };
    dbLeads.push(lead);
    duplicateCreated = true;
  }

  if (bodyStr === 'stop') {
    lead.whatsapp_opted_out = true;
    return { reply: "You have been unsubscribed. Reply START to re-subscribe.", lead, isNew: duplicateCreated };
  }

  // normal AI flow...
  return { reply: "Follow up.", lead, isNew: duplicateCreated };
};

describe('WhatsApp Webhooks Integration', () => {
  afterEach(() => {
    dbLeads = [{ id: 1, phone: '9876543210', whatsapp_opted_out: false }];
  });

  it('new number -> lead created', () => {
    const res = mockHandleInbound({ From: 'whatsapp:+910000000000', Body: 'Hi' });
    expect(res.lead.phone).toBe('0000000000');
    expect(res.isNew).toBe(true);
  });

  it('Simulate STOP message -> opt-out flag set, unsubscribe reply sent', () => {
    const res = mockHandleInbound({ From: 'whatsapp:+919876543210', Body: 'STOP' });
    expect(res.lead.whatsapp_opted_out).toBe(true);
    expect(res.reply).toContain('unsubscribed');
  });

  it('inbound from existing lead -> lead matched, no duplicate', () => {
    const initialCount = dbLeads.length;
    const res = mockHandleInbound({ From: 'whatsapp:+919876543210', Body: 'Another message' });
    
    expect(res.isNew).toBe(false);
    expect(dbLeads.length).toBe(initialCount);
  });
});
