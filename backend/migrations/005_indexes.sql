-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS leads_org_id_stage_idx ON leads (org_id, stage);
CREATE INDEX IF NOT EXISTS leads_org_id_created_at_idx ON leads (org_id, created_at DESC);

CREATE INDEX IF NOT EXISTS call_logs_org_id_idx ON call_logs (org_id);

CREATE INDEX IF NOT EXISTS usage_logs_org_id_created_at_idx ON usage_logs (org_id, created_at DESC);
