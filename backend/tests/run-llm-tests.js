require('dotenv').config({ path: __dirname + '/../.env' });
const fs = require('fs');
const { generate } = require('../src/llm/llmRouter');
const supabase = require('../config/supabase');

const testVariables = {
  'lead_followup_whatsapp': [
    { lead_name: 'Rahul', product: 'Premium CRM', agent_name: 'Anita', company: 'LeadOS' },
    { lead_name: 'Priya', product: 'Marketing Suite', agent_name: 'Karan', company: 'Acme Corp' },
    { lead_name: 'Amit', product: 'Cloud Hosting', agent_name: 'Neha', company: 'TechSolutions' },
    { lead_name: 'Sunil', product: 'Business Broadband', agent_name: 'Rohit', company: 'ConnectFast' }
  ],
  'social_caption_instagram': [
    { product: 'Wireless Earbuds', offer: '20% off', tone: 'exciting', hashtag_count: '5' },
    { product: 'Stand Mixer', offer: 'Free delivery', tone: 'warm', hashtag_count: '8' },
    { product: 'Running Shoes', offer: 'Buy 1 Get 1', tone: 'energetic', hashtag_count: '6' },
    { product: 'Leather Wallet', offer: '10% intro discount', tone: 'luxurious', hashtag_count: '10' }
  ],
  'social_caption_linkedin': [
    { topic: 'AI in Sales', company: 'LeadOS', cta: 'Book a demo today!' },
    { topic: 'Remote Work Trends', company: 'WorkAnywhere', cta: 'Read the full report on our blog.' },
    { topic: 'Data Privacy 2026', company: 'SecureVault', cta: 'Contact us for an audit.' },
    { topic: 'B2B Marketing Strategies', company: 'GrowthHackers', cta: 'Subscribe to our newsletter.' }
  ],
  'payment_reminder_whatsapp': [
    { lead_name: 'Deepak', amount: '$500', due_date: 'tomorrow', payment_link: 'pay.me/123' },
    { lead_name: 'Sonia', amount: '$150', due_date: 'March 25', payment_link: 'pay.me/456' },
    { lead_name: 'Vikas', amount: '$1000', due_date: 'today', payment_link: 'pay.me/789' },
    { lead_name: 'Pooja', amount: '$75', due_date: 'Friday', payment_link: 'pay.me/000' }
  ],
  'ai_lead_qualification_score': [
    { lead_data: JSON.stringify({ title: 'CEO', companySize: 100, budget: '10k+', urgency: 'high' }) },
    { lead_data: JSON.stringify({ title: 'Intern', companySize: 5, budget: 'none', urgency: 'low' }) },
    { lead_data: JSON.stringify({ title: 'Manager', companySize: 50, budget: '1k-5k', urgency: 'medium' }) },
    { lead_data: JSON.stringify({ title: 'Founder', companySize: 10, budget: '5k+', urgency: 'high' }) }
  ]
};

async function createMigrations() {
  try {
    const { error } = await supabase.from('prompt_templates').upsert([
      { name: 'lead_followup_whatsapp', content: 'Greeting: Hello {lead_name},\nValue Prop: We help SMEs like yours connect instantly.\nPain Point: Sick of missing inquiries?\nSocial Proof: Over 500 businesses trust LeadOS.\nCTA: Reply YES to our quick demo link!\nSignature: Best, {agent_name} from {company}', version: 1 },
      { name: 'social_caption_instagram', content: 'Write an engaging caption for an Instagram post about {product}. Highlight the {offer} and make the tone {tone}. Add precisely {hashtag_count} hashtags to the end. Keep it under 150 words.', version: 1 },
      { name: 'social_caption_linkedin', content: 'Write a professional LinkedIn post about {topic}. End the post with a call to action: {cta}. Relate it to the business {company}. Must be 100-200 words. Absolutely no hashtag spam. Professional tone only.', version: 1 },
      { name: 'payment_reminder_whatsapp', content: 'Hi {lead_name}, just a quick reminder that your payment of {amount} is due by {due_date}. Please complete it here: {payment_link}. Thank you!', version: 1 },
      { name: 'ai_lead_qualification_score', content: 'Analyze this lead data: {lead_data}.\nReturn valid JSON only matching exactly this structure:\n{\n  "score": 85,\n  "tier": "hot", \n  "reason": "Clear high intent",\n  "next_action": "Call immediately"\n}\nOutput strictly ONLY valid JSON.', version: 1 }
    ]);
    if(error && error.code !== 'PGRST116') console.warn('Supabase template insert warn:', error.message);
  } catch(e) { console.warn('Supabase unavailable locally. Proceeding to tests...'); }
}

async function runTests() {
  await createMigrations();
  let report = [];
  
  for (const [templateName, inputs] of Object.entries(testVariables)) {
    console.log(`Testing ${templateName}...`);
    for (const vars of inputs) {
      try {
        const result = await generate({ templateName, variables: vars, orgId: 'test_org' });
        
        // Cost calculation for the report
        let costUsd = 0;
        if (result.model === 'gpt-4o-mini') {
          costUsd = (result.tokensIn * 0.00015 / 1000) + (result.tokensOut * 0.00060 / 1000);
        } else if (result.model === 'gpt-4o') {
          costUsd = (result.tokensIn * 0.005 / 1000) + (result.tokensOut * 0.015 / 1000);
        }
        
        report.push({
          template: templateName,
          input: vars,
          output: result.text,
          model: result.model,
          tokens: result.tokensUsed,
          cost_usd: result.cached ? 0 : costUsd,
          cached: result.cached,
          flagged: result.flagged
        });
        
        console.log(`  -> Success. Cached: ${result.cached}, Tokens: ${result.tokensUsed}, Cost: $${costUsd.toFixed(6)}`);
      } catch (err) {
        console.error(`  -> Failed: ${err.message}`);
        report.push({
          template: templateName,
          input: vars,
          error: err.message
        });
      }
    }
  }
  
  fs.writeFileSync(__dirname + '/llm-test-report.json', JSON.stringify(report, null, 2));
  console.log('All tests completed. Report generated at /backend/tests/llm-test-report.json');
}

runTests();
