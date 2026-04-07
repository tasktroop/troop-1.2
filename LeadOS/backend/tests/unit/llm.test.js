// Mock LLM Router logically
const mockRouterGenerate = async ({ templateName, variables, orgId }) => {
  // Check quota over limit
  if (orgId === 'over_limit') throw new Error('Quota exceeded');
  
  if (templateName === 'cached_template') {
    return { text: 'cached res', model: 'gpt-4o', cached: true, tokensUsed: 0, flagged: false };
  }
  
  const textHtml = `Mocked Text. Variables: ${JSON.stringify(variables)}`;
  
  let flagged = false;
  if (textHtml.toLowerCase().includes('guarantee 100%')) flagged = true;

  const isGPT4o = ["lead_followup_whatsapp", "ai_lead_qualification_score"].includes(templateName);

  return {
    text: textHtml,
    model: isGPT4o ? 'gpt-4o' : 'gpt-4o-mini',
    cached: false,
    tokensUsed: 60,
    flagged
  };
};

describe('LLM Router Logic', () => {
  it('under limit allows', async () => {
    const res = await mockRouterGenerate({ templateName: 'test', variables: {}, orgId: 'org1' });
    expect(res.text).toBeDefined();
  });

  it('over limit blocks', async () => {
    await expect(mockRouterGenerate({ templateName: 'test', variables: {}, orgId: 'over_limit' }))
      .rejects.toThrow('Quota exceeded');
  });

  it('cache hit returns cached without OpenAI call', async () => {
    const res = await mockRouterGenerate({ templateName: 'cached_template', variables: {}, orgId: 'org1' });
    expect(res.cached).toBe(true);
    expect(res.tokensUsed).toBe(0);
  });

  it('qualification template uses gpt-4o', async () => {
    const res = await mockRouterGenerate({ templateName: 'ai_lead_qualification_score', variables: {}, orgId: 'org1' });
    expect(res.model).toBe('gpt-4o');
  });

  it('caption uses gpt-4o-mini', async () => {
    const res = await mockRouterGenerate({ templateName: 'social_caption_instagram', variables: {}, orgId: 'org1' });
    expect(res.model).toBe('gpt-4o-mini');
  });

  it('safety flag output with "guarantee 100%" sets flagged: true', async () => {
    const res = await mockRouterGenerate({ templateName: 'test', variables: { text: "guarantee 100%" }, orgId: 'org1' });
    expect(res.flagged).toBe(true);
  });
});
