const express = require('express');
const { generateWeeklyReport } = require('../analytics/weeklyReport');
const { requireRole } = require('../middleware/rbac');
const supabase = require('../config/supabase'); // config
const router = express.Router();

router.get('/report', requireRole(['admin']), async (req, res) => {
  try {
    const orgId = req.user?.orgId || req.query.orgId || 'default';
    const report = await generateWeeklyReport(orgId);
    res.json(report);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/llm-usage', async (req, res) => {
  try {
    const orgId = req.user?.orgId || req.query.orgId || 'default';
    const { data: usage } = await supabase.from('usage_logs').select('*').eq('org_id', orgId);
    res.json(usage || []);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/posts', async (req, res) => {
  try {
    const orgId = req.user?.orgId || req.query.orgId || 'default';
    // MOCK ENGAGEMENT METRICS
    res.json({ published: 3, scheduled: 5, failed: 1, top_engaging: "LinkedIn Intro" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

router.get('/leads/funnel', async (req, res) => {
  try {
    const orgId = req.user?.orgId || req.query.orgId || 'default';
    const { data } = await supabase.from('leads').select('stage').eq('org_id', orgId);
    if (!data) return res.json({});
    const funnel = data.reduce((acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1;
      return acc;
    }, {});
    // e.g { new: 10, contacted: 5, qualified: 2 }
    res.json(funnel);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
