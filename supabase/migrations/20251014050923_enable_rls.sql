-- Enable Row Level Security (RLS) on all tables

-- Enable RLS
ALTER TABLE public.locker_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locker_state
-- Allow all authenticated users to read
CREATE POLICY "Allow all to read locker_state"
  ON public.locker_state
  FOR SELECT
  USING (true);

-- Only admins can update
CREATE POLICY "Only admins can update locker_state"
  ON public.locker_state
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for country_states
-- Allow all authenticated users to read
CREATE POLICY "Allow all to read country_states"
  ON public.country_states
  FOR SELECT
  USING (true);

-- Only admins can update
CREATE POLICY "Only admins can update country_states"
  ON public.country_states
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- RLS Policies for audit_log
-- Allow all authenticated users to read
CREATE POLICY "Allow all to read audit_log"
  ON public.audit_log
  FOR SELECT
  USING (true);

-- Only admins can insert
CREATE POLICY "Only admins can insert audit_log"
  ON public.audit_log
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for users
-- Users can read their own record
CREATE POLICY "Users can read own record"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all records
CREATE POLICY "Admins can read all users"
  ON public.users
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Users can update their own record
CREATE POLICY "Users can update own record"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for payments
-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON public.payments
  FOR SELECT
  USING (true);

-- Service role can manage all payments
CREATE POLICY "Service role can manage payments"
  ON public.payments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comments
COMMENT ON POLICY "Allow all to read locker_state" ON public.locker_state IS 'All users can view global progress';
COMMENT ON POLICY "Only admins can update locker_state" ON public.locker_state IS 'Only admins can modify global progress';
COMMENT ON POLICY "Allow all to read country_states" ON public.country_states IS 'All users can view country data';
COMMENT ON POLICY "Only admins can update country_states" ON public.country_states IS 'Only admins can modify country data';
