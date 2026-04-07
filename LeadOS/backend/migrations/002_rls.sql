-- 002_rls.sql
-- Enable Row Level Security on all tables

ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Create a helper function to get current user's org_id
-- We assume the org_id is passed via JWT claims
CREATE OR REPLACE FUNCTION get_current_org_id()
RETURNS UUID AS $$
BEGIN
  RETURN (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for each table enforcing org_id isolation

-- 1. Orgs
CREATE POLICY orgs_isolation_policy ON orgs
  FOR ALL
  USING (id = get_current_org_id())
  WITH CHECK (id = get_current_org_id());

-- 2. Users
CREATE POLICY users_isolation_policy ON users
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 3. Leads
CREATE POLICY leads_isolation_policy ON leads
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 4. Lead Notes
CREATE POLICY lead_notes_isolation_policy ON lead_notes
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 5. Posts
CREATE POLICY posts_isolation_policy ON posts
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 6. Approvals
CREATE POLICY approvals_isolation_policy ON approvals
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 7. Call Logs
CREATE POLICY call_logs_isolation_policy ON call_logs
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 8. Subscriptions
CREATE POLICY subscriptions_isolation_policy ON subscriptions
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 9. Prompt Templates
CREATE POLICY prompt_templates_isolation_policy ON prompt_templates
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());

-- 10. Usage Logs
CREATE POLICY usage_logs_isolation_policy ON usage_logs
  FOR ALL
  USING (org_id = get_current_org_id())
  WITH CHECK (org_id = get_current_org_id());
