const db = {
  approvals: [],
  leads: [{ id: 1, org_id: 'org1', stage: 'contacted' }]
};

const mockCreateApproval = (leadId, draft) => {
  const approval = { id: Date.now(), leadId, draft, status: 'pending' };
  db.approvals.push(approval);
  return approval;
};

const mockUpdateApproval = (approvalId, status, comment, role) => {
  if (role !== 'admin' && role !== 'manager') throw new Error('Forbidden');
  const app = db.approvals.find(a => a.id === approvalId);
  if (!app) throw new Error('Not found');

  app.status = status;
  app.comment = comment || null;

  if (status === 'approved') {
    const lead = db.leads.find(l => l.id === app.leadId);
    if (lead) lead.stage = 'qualified';
  }
  return app;
};

describe('Approvals Workflow', () => {
  it('Create approval -> view -> manager approves -> lead stage updates', () => {
    const app = mockCreateApproval(1, 'Draft content');
    expect(app.status).toBe('pending');
    
    const view = db.approvals.find(a => a.id === app.id);
    expect(view).toBeDefined();

    mockUpdateApproval(app.id, 'approved', '', 'manager');
    
    const lead = db.leads.find(l => l.id === 1);
    expect(lead.stage).toBe('qualified');
  });

  it('Admin rejects with comment -> comment saved to DB', () => {
    const app = mockCreateApproval(1, 'Bad draft');
    const updated = mockUpdateApproval(app.id, 'rejected', 'Needs rewrite', 'admin');
    
    expect(updated.status).toBe('rejected');
    expect(updated.comment).toBe('Needs rewrite');
  });
});
