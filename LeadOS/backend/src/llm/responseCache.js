const crypto = require('crypto');
const supabase = require('../../config/supabase');

module.exports = {
  get: async (templateName, variables) => {
    try {
      const cacheKey = crypto.createHash('sha256').update(templateName + JSON.stringify(variables)).digest('hex');
      const { data, error } = await supabase
        .from('response_cache')
        .select('value, expires_at')
        .eq('key', cacheKey)
        .single();

      if (error && error.code !== 'PGRST116') return null; // PGRST116 is no rows returned which is fine
      if (data && new Date(data.expires_at) > new Date()) {
        return data.value;
      }
    } catch (e) { console.warn("Cache GET error, ignoring."); }
    return null;
  },
  
  set: async (templateName, variables, value, ttlSeconds = 86400) => {
    try {
      const cacheKey = crypto.createHash('sha256').update(templateName + JSON.stringify(variables)).digest('hex');
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
      await supabase
        .from('response_cache')
        .upsert({ key: cacheKey, value, expires_at: expiresAt });
    } catch (e) {
      console.warn("Cache SET error, ignoring.", e.message);
    }
  }
};
