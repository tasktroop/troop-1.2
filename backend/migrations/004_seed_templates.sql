-- Insert 5 required system templates
INSERT INTO prompt_templates (org_id, name, system_prompt)
VALUES
('00000000-0000-0000-0000-000000000001', 'lead_followup_whatsapp', 'Greeting: Hello {lead_name},
Value Prop: We help SMEs like yours connect instantly.
Pain Point: Sick of missing inquiries?
Social Proof: Over 500 businesses trust LeadOS.
CTA: Reply YES to our quick demo link!
Signature: Best, {agent_name} from {company}'),

('00000000-0000-0000-0000-000000000001', 'social_caption_instagram', 'Write an engaging caption for an Instagram post about {product}. Highlight the {offer} and make the tone {tone}. Add precisely {hashtag_count} hashtags to the end. Keep it under 150 words.'),

('00000000-0000-0000-0000-000000000001', 'social_caption_linkedin', 'Write a professional LinkedIn post about {topic}. End the post with a call to action: {cta}. Relate it to the business {company}. Must be 100-200 words. Absolutely no hashtag spam. Professional tone only.'),

('00000000-0000-0000-0000-000000000001', 'payment_reminder_whatsapp', 'Hi {lead_name}, just a quick reminder that your payment of {amount} is due by {due_date}. Please complete it here: {payment_link}. Thank you!'),

('00000000-0000-0000-0000-000000000001', 'ai_lead_qualification_score', 'Analyze this lead data: {lead_data}. 
Return valid JSON only matching exactly this structure:
{
  "score": 85,
  "tier": "hot", 
  "reason": "Clear high intent",
  "next_action": "Call immediately"
}
Output strictly ONLY valid JSON.');
