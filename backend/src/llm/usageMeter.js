const supabase = require('../config/supabase');

module.exports = {
  logUsage: async ({ orgId, model, tokensIn, tokensOut, templateName }) => {
    let cost = 0;
    if (model === 'gpt-4o-mini') {
      cost = (tokensIn * 0.00015 / 1000) + (tokensOut * 0.00060 / 1000);
    } else if (model === 'gpt-4o') {
      cost = (tokensIn * 0.005 / 1000) + (tokensOut * 0.015 / 1000);
    }

    await supabase.from('usage_logs').insert({
      org_id: orgId || null,
      model,
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      cost_usd: cost,
      template_name: templateName,
    });
  },

  checkQuota: async (orgId) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    
    if (!orgId) return { allowed: true, used: 0, limit: 100000 };

    const { data } = await supabase
      .from('usage_logs')
      .select('tokens_in, tokens_out')
      .eq('org_id', orgId)
      .gte('created_at', startOfMonth);

    let used = 0;
    if (data) {
      used = data.reduce((acc, row) => acc + row.tokens_in + row.tokens_out, 0);
    }

    return { allowed: used < 100000, used, limit: 100000 };
  }
};
