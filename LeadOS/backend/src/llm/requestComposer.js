module.exports = {
  compose: ({ templateName, variables, orgId, templateContent }) => {
    let model = 'gpt-4o-mini';
    if (['lead_followup_whatsapp', 'ai_lead_qualification_score'].includes(templateName)) {
      model = 'gpt-4o';
    }

    let prompt = templateContent || '';
    if (variables) {
      for (const [k, v] of Object.entries(variables)) {
        prompt = prompt.split(`{${k}}`).join(v);
      }
    }

    return {
      model,
      messages: [
        { role: 'system', content: 'You are LeadOS AI, a sales assistant for Indian SMEs. Be concise, friendly, and bilingual (Hindi/English) when needed.' },
        { role: 'user', content: prompt }
      ]
    };
  }
};
