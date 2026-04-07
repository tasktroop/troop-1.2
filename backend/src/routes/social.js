const express = require('express');
const { schedulePost } = require('../integrations/buffer/scheduler');
const supabase = require('../../config/supabase');
const router = express.Router();

router.post('/schedule', async (req, res) => {
  try {
    const orgId = req.user?.orgId || req.body.orgId || 'default';
    const { platform, content, scheduledAt } = req.body;
    const post = await schedulePost({ platform, content, scheduledAt, orgId });
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const orgId = req.user?.orgId || req.query.orgId || 'default';
    const { data } = await supabase.from('posts').select('*').eq('org_id', orgId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
