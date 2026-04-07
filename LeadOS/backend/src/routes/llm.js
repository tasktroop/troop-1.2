const express = require('express');
const llmRouter = require('../llm/llmRouter');
const usageMeter = require('../llm/usageMeter');
const supabase = require('../../config/supabase');
const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { templateName, variables, orgId } = req.body;
    // Real orgId should come from JWT, assuming req.user exists in real flow
    const explicitOrgId = req.user?.orgId || orgId; 
    const result = await llmRouter.generate({ templateName, variables, orgId: explicitOrgId });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/usage', async (req, res) => {
  const orgId = req.user?.orgId || req.query.orgId;
  const result = await usageMeter.checkQuota(orgId);
  res.json(result);
});

router.get('/templates', async (req, res) => {
  const { data, error } = await supabase.from('prompt_templates').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
