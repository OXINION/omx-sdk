-- Secure demo fix - allow service_role access only
-- Run this directly in the Supabase SQL editor

-- Create policies that allow service_role to bypass RLS for demo operations
CREATE POLICY "service_role_devices_access" ON omx.devices
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_category_subscriptions_access" ON omx.category_subscriptions
  FOR ALL  
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_notification_intents_access" ON omx.notification_intents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Alternative: Create demo-specific policies for devices without team_id
CREATE POLICY "demo_devices_no_team" ON omx.devices
  FOR INSERT
  TO authenticated
  WITH CHECK (team_id IS NULL AND user_id IS NULL);

CREATE POLICY "demo_devices_select_no_team" ON omx.devices
  FOR SELECT
  TO authenticated
  USING (team_id IS NULL);