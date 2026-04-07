const axios = require('axios');
const supabase = require('../../../config/supabase');
const schedulePost = async ({ platform, content, scheduledAt, orgId }) => {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  let status = "scheduled";
  let externalId = null;

  try {
    if (!token) throw new Error('Missing BUFFER_ACCESS_TOKEN. Falling back.');
    
    const profile_ids = ["mock_profile_id_from_db"]; 
    
    const response = await axios.post('https://api.bufferapp.com/1/updates/create.json', {
      text: content,
      profile_ids,
      scheduled_at: scheduledAt
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    externalId = response.data?.updates?.[0]?.id || null;
  } catch (error) {
    console.warn(`Buffer API Error for ${platform}:`, error.message);
    status = "pending_manual"; // fallback
    console.log(`[ALERT] Failed to schedule Buffer post for org ${orgId}. Post set to pending_manual.`);
  }

  // Create table dynamically or assume 'posts' exists. We will use 'posts' per prompt
  const { data } = await supabase.from('posts').upsert({
    org_id: orgId || null,
    platform,
    content,
    scheduled_at: scheduledAt,
    status,
    external_id: externalId
  }).select().single();

  return data;
};

module.exports = { schedulePost };
