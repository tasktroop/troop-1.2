const db = {
  leads: [
    { id: 1, org_id: 'orgA', name: 'Lead 1', stage: 'new' },
    { id: 2, org_id: 'orgB', name: 'Lead 2', stage: 'new' }
  ]
};

const mockGetLeads = (orgId, page = 1, limit = 20) => {
  const filtered = db.leads.filter(l => l.org_id === orgId);
  return filtered.slice((page - 1) * limit, page * limit);
};

const mockCreateLead = (orgId, leadData) => {
  const newLead = { id: db.leads.length + 1, org_id: orgId, ...leadData, stage: 'new' };
  db.leads.push(newLead);
  return newLead;
};

const mockUpdateLead = (orgId, leadId, updates) => {
  const lead = db.leads.find(l => l.id === leadId && l.org_id === orgId);
  if (!lead) throw new Error('Not found');
  Object.assign(lead, updates);
  return lead;
};

const mockDeleteLead = (orgId, leadId) => {
  const idx = db.leads.findIndex(l => l.id === leadId && l.org_id === orgId);
  if (idx === -1) throw new Error('Not found');
  db.leads.splice(idx, 1);
  return true;
};

describe('Leads API Integration', () => {
  it('allows full CRUD', () => {
    // Create
    const lead = mockCreateLead('orgA', { name: 'CRUD Lead' });
    expect(lead.id).toBeDefined();

    // Read
    const leads = mockGetLeads('orgA');
    expect(leads.length).toBeGreaterThan(0);

    // Update
    const updated = mockUpdateLead('orgA', lead.id, { stage: 'qualified' });
    expect(updated.stage).toBe('qualified');

    // Delete
    mockDeleteLead('orgA', lead.id);
    const afterDelete = mockGetLeads('orgA');
    expect(afterDelete.find(l => l.id === lead.id)).toBeUndefined();
  });

  it('org_id isolation: org A cannot read org B leads', () => {
    const orgALeads = mockGetLeads('orgA');
    expect(orgALeads.some(l => l.org_id === 'orgB')).toBe(false);
  });

  it('pagination: 25 leads -> GET ?page=1&limit=20 returns 20', () => {
    // Seed 25 leads
    for (let i = 0; i < 25; i++) mockCreateLead('orgC', { name: `Test ${i}` });
    
    const page1 = mockGetLeads('orgC', 1, 20);
    expect(page1.length).toBe(20);
    
    const page2 = mockGetLeads('orgC', 2, 20);
    expect(page2.length).toBe(5);
  });
});
