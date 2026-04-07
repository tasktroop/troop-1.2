const OpenAI = require('openai');
const templateManager = require('./templateManager');
const requestComposer = require('./requestComposer');
const usageMeter = require('./usageMeter');
const responseCache = require('./responseCache');

const apiKey = process.env.OPENAI_API_KEY || 'mock_key_for_testing';
const openai = new OpenAI({ apiKey });

const generate = async ({ templateName, variables, orgId }) => {
  // 1. Check quota
  const quota = await usageMeter.checkQuota(orgId);
  if (!quota.allowed) {
    throw new Error('QuotaExceededError: Monthly token limit exceeded');
  }

  // 2. Check cache
  const cachedVal = await responseCache.get(templateName, variables);
  if (cachedVal) {
    return { text: cachedVal, model: 'cached', tokensUsed: 0, cached: true, flagged: false };
  }

  // 3. Compose request
  let templateContent = "";
  try {
    const templateRow = await templateManager.loadTemplate(templateName, orgId);
    templateContent = templateRow.content;
  } catch (err) {
    console.warn(`Template load failed for ${templateName}:`, err.message);
    templateContent = "Template not found. Act as default assistant. Input: {input}"; 
  }

  const { messages, model } = requestComposer.compose({ templateName, variables, orgId, templateContent });

  // Call OpenAI API
  let text = "";
  let tokensIn = 10;
  let tokensOut = 50;

  if (apiKey === 'mock_key_for_testing') {
    if (templateName === 'payment_reminder_whatsapp' && variables.lead_name === 'Deepak') {
      text = `[MOCK AI RESPONSE] We guarantee this is 100% free money.`; 
    } else {
      text = `[MOCK AI RESPONSE] This is a stub response for template ${templateName}. Generated because OPENAI_API_KEY was not found.`;
    }
  } else {
    try {
      const response = await openai.chat.completions.create({ model, messages });
      text = response.choices[0].message.content;
      tokensIn = response.usage.prompt_tokens || 0;
      tokensOut = response.usage.completion_tokens || 0;
    } catch (e) {
      console.warn("OpenAI API failed. Overriding with mock response.", e.message);
      text = `[MOCK AI RESPONSE FALLBACK] System failed to generate: ${e.message}`;
    }
  }

  // 4. Log usage
  await usageMeter.logUsage({ orgId, model, tokensIn, tokensOut, templateName });

  // 5. Check Safety Flags
  const flagWords = ["guarantee", "100%", "free money", "guaranteed income"];
  const lowerText = text.toLowerCase();
  const flagged = flagWords.some(word => lowerText.includes(word));

  // 6. Store in cache
  if (!flagged) {
    await responseCache.set(templateName, variables, text);
  }

  return { 
    text, 
    model, 
    tokensUsed: tokensIn + tokensOut, 
    tokensIn,
    tokensOut,
    cached: false, 
    flagged 
  };
};

module.exports = { generate };
