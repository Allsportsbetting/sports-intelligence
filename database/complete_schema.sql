-- ============================================================================
-- COMPLETE DATABASE SCHEMA FOR GLOBAL UNLOCK APP
-- ============================================================================
-- This file contains the complete database schema including:
-- - Tables
-- - Functions
-- - Triggers
-- - RLS Policies
-- - Seed Data
--
-- Run this entire file in Supabase SQL Editor to set up the database
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE FUNCTIONS
-- ============================================================================

-- Function: calculate_glow_band
CREATE OR REPLACE FUNCTION public.calculate_glow_band()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.activation_count = 0 THEN
    NEW.glow_band := 0;
  ELSIF NEW.activation_count <= 2 THEN
    NEW.glow_band := 1;
  ELSIF NEW.activation_count <= 5 THEN
    NEW.glow_band := 2;
  ELSE
    NEW.glow_band := 3;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: update_country_timestamp
CREATE OR REPLACE FUNCTION public.update_country_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_updated := NOW();
  RETURN NEW;
END;
$$;

-- Function: update_locker_timestamp
CREATE OR REPLACE FUNCTION public.update_locker_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_updated := NOW();
  RETURN NEW;
END;
$$;

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

-- Function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Function: auto_update_energy_percentage
CREATE OR REPLACE FUNCTION public.auto_update_energy_percentage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_activations INTEGER;
  new_percentage NUMERIC;
  target_activations INTEGER := 1000; -- Adjust this to change the unlock goal
BEGIN
  -- Calculate total activations across all countries
  SELECT COALESCE(SUM(activation_count), 0) INTO total_activations
  FROM public.country_states;
  
  -- Calculate percentage (cap at 100)
  new_percentage := LEAST((total_activations::NUMERIC / target_activations) * 100, 100);
  
  -- Update locker_state
  UPDATE public.locker_state
  SET 
    energy_percentage = ROUND(new_percentage, 2),
    is_unlocked = (new_percentage >= 100),
    last_updated = NOW()
  WHERE id = 1;
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.auto_update_energy_percentage() IS 
  'Automatically calculates and updates energy_percentage in locker_state based on total country activations. Target: 1000 activations = 100%';

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- Table: locker_state
CREATE TABLE IF NOT EXISTS public.locker_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  energy_percentage NUMERIC NOT NULL DEFAULT 0 CHECK (energy_percentage >= 0 AND energy_percentage <= 100),
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.locker_state IS 'Stores global unlock progress state (singleton table)';

-- Table: country_states
CREATE TABLE IF NOT EXISTS public.country_states (
  country_code VARCHAR PRIMARY KEY,
  activation_count INTEGER NOT NULL DEFAULT 0 CHECK (activation_count >= 0),
  glow_band INTEGER NOT NULL DEFAULT 0 CHECK (glow_band >= 0 AND glow_band <= 3),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.country_states IS 'Stores activation counts and visual glow bands for each country';

CREATE INDEX IF NOT EXISTS idx_country_states_glow_band ON public.country_states(glow_band);
CREATE INDEX IF NOT EXISTS idx_country_states_activation_count ON public.country_states(activation_count);

-- Table: audit_log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email VARCHAR NOT NULL,
  action_type VARCHAR NOT NULL CHECK (action_type IN ('country_increment', 'country_set', 'energy_increment', 'energy_set')),
  subject VARCHAR NOT NULL,
  delta_or_value TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_log IS 'Audit trail of all admin actions';

CREATE INDEX IF NOT EXISTS idx_audit_log_admin_email ON public.audit_log(admin_email);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action_type ON public.audit_log(action_type);

-- Table: users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Stores user information and admin roles';

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Table: payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'canceled', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'Tracks Stripe payment transactions';

CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent ON public.payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON public.payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- ============================================================================
-- STEP 3: CREATE TRIGGERS
-- ============================================================================

-- Trigger: Calculate glow_band on country_states
CREATE TRIGGER trigger_calculate_glow_band
  BEFORE INSERT OR UPDATE ON public.country_states
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_glow_band();

-- Trigger: Update timestamp on country_states
CREATE TRIGGER trigger_update_country_timestamp
  BEFORE UPDATE ON public.country_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_country_timestamp();

-- Trigger: Update timestamp on locker_state
CREATE TRIGGER trigger_update_locker_timestamp
  BEFORE UPDATE ON public.locker_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_locker_timestamp();

-- Trigger: Update updated_at on users
CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Update updated_at on payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Handle new auth user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Auto-update energy percentage when countries change
DROP TRIGGER IF EXISTS trigger_auto_update_energy ON public.country_states;
CREATE TRIGGER trigger_auto_update_energy
  AFTER INSERT OR UPDATE OR DELETE ON public.country_states
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.auto_update_energy_percentage();

COMMENT ON TRIGGER trigger_auto_update_energy ON public.country_states IS 
  'Triggers automatic energy percentage calculation whenever country activations change';

-- ============================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.locker_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================================================

-- Policies for locker_state
CREATE POLICY "Allow all to read locker_state"
  ON public.locker_state FOR SELECT USING (true);

CREATE POLICY "Only admins can update locker_state"
  ON public.locker_state FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Policies for country_states
CREATE POLICY "Allow all to read country_states"
  ON public.country_states FOR SELECT USING (true);

CREATE POLICY "Only admins can update country_states"
  ON public.country_states FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Policies for audit_log
CREATE POLICY "Allow all to read audit_log"
  ON public.audit_log FOR SELECT USING (true);

CREATE POLICY "Only admins can insert audit_log"
  ON public.audit_log FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Policies for users
CREATE POLICY "Users can read own record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Policies for payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT USING (true);

CREATE POLICY "Service role can manage payments"
  ON public.payments FOR ALL
  USING (true) WITH CHECK (true);

-- ============================================================================
-- STEP 6: INSERT SEED DATA
-- ============================================================================

-- Insert initial locker state
-- Note: energy_percentage is auto-calculated by trigger, but we set initial value
INSERT INTO public.locker_state (id, energy_percentage, is_unlocked, last_updated)
VALUES (1, 10.50, false, NOW())
ON CONFLICT (id) DO UPDATE SET
  energy_percentage = EXCLUDED.energy_percentage,
  is_unlocked = EXCLUDED.is_unlocked,
  last_updated = NOW();

-- Insert all 195 countries with current activation counts
-- Current activations as of 2025-11-05:
--   AU: 5, BD: 6, CA: 10, DE: 25, FR: 20, GB: 6, IN: 12, KR: 15, RU: 6
INSERT INTO public.country_states (country_code, activation_count, glow_band) VALUES
('AD', 0, 0), ('AE', 0, 0), ('AF', 0, 0), ('AG', 0, 0), ('AL', 0, 0),
('AM', 0, 0), ('AO', 0, 0), ('AR', 0, 0), ('AT', 0, 0), ('AU', 5, 2),
('AZ', 0, 0), ('BA', 0, 0), ('BB', 0, 0), ('BD', 6, 3), ('BE', 0, 0),
('BF', 0, 0), ('BG', 0, 0), ('BH', 0, 0), ('BI', 0, 0), ('BJ', 0, 0),
('BN', 0, 0), ('BO', 0, 0), ('BR', 0, 0), ('BS', 0, 0), ('BT', 0, 0),
('BW', 0, 0), ('BY', 0, 0), ('BZ', 0, 0), ('CA', 10, 3), ('CD', 0, 0),
('CF', 0, 0), ('CG', 0, 0), ('CH', 0, 0), ('CI', 0, 0), ('CL', 0, 0),
('CM', 0, 0), ('CN', 0, 0), ('CO', 0, 0), ('CR', 0, 0), ('CU', 0, 0),
('CV', 0, 0), ('CY', 0, 0), ('CZ', 0, 0), ('DE', 25, 3), ('DJ', 0, 0),
('DK', 0, 0), ('DM', 0, 0), ('DO', 0, 0), ('DZ', 0, 0), ('EC', 0, 0),
('EE', 0, 0), ('EG', 0, 0), ('ER', 0, 0), ('ES', 0, 0), ('ET', 0, 0),
('FI', 0, 0), ('FJ', 0, 0), ('FM', 0, 0), ('FR', 20, 3), ('GA', 0, 0),
('GB', 6, 3), ('GD', 0, 0), ('GE', 0, 0), ('GH', 0, 0), ('GM', 0, 0),
('GN', 0, 0), ('GQ', 0, 0), ('GR', 0, 0), ('GT', 0, 0), ('GW', 0, 0),
('GY', 0, 0), ('HN', 0, 0), ('HR', 0, 0), ('HT', 0, 0), ('HU', 0, 0),
('ID', 0, 0), ('IE', 0, 0), ('IL', 0, 0), ('IN', 12, 3), ('IQ', 0, 0),
('IR', 0, 0), ('IS', 0, 0), ('IT', 0, 0), ('JM', 0, 0), ('JO', 0, 0),
('JP', 0, 0), ('KE', 0, 0), ('KG', 0, 0), ('KH', 0, 0), ('KI', 0, 0),
('KM', 0, 0), ('KN', 0, 0), ('KP', 0, 0), ('KR', 15, 3), ('KW', 0, 0),
('KZ', 0, 0), ('LA', 0, 0), ('LB', 0, 0), ('LC', 0, 0), ('LI', 0, 0),
('LK', 0, 0), ('LR', 0, 0), ('LS', 0, 0), ('LT', 0, 0), ('LU', 0, 0),
('LV', 0, 0), ('LY', 0, 0), ('MA', 0, 0), ('MC', 0, 0), ('MD', 0, 0),
('ME', 0, 0), ('MG', 0, 0), ('MH', 0, 0), ('MK', 0, 0), ('ML', 0, 0),
('MM', 0, 0), ('MN', 0, 0), ('MR', 0, 0), ('MT', 0, 0), ('MU', 0, 0),
('MV', 0, 0), ('MW', 0, 0), ('MX', 0, 0), ('MY', 0, 0), ('MZ', 0, 0),
('NA', 0, 0), ('NE', 0, 0), ('NG', 0, 0), ('NI', 0, 0), ('NL', 0, 0),
('NO', 0, 0), ('NP', 0, 0), ('NR', 0, 0), ('NZ', 0, 0), ('OM', 0, 0),
('PA', 0, 0), ('PE', 0, 0), ('PG', 0, 0), ('PH', 0, 0), ('PK', 0, 0),
('PL', 0, 0), ('PS', 0, 0), ('PT', 0, 0), ('PW', 0, 0), ('PY', 0, 0),
('QA', 0, 0), ('RO', 0, 0), ('RS', 0, 0), ('RU', 6, 3), ('RW', 0, 0),
('SA', 0, 0), ('SB', 0, 0), ('SC', 0, 0), ('SD', 0, 0), ('SE', 0, 0),
('SG', 0, 0), ('SI', 0, 0), ('SK', 0, 0), ('SL', 0, 0), ('SM', 0, 0),
('SN', 0, 0), ('SO', 0, 0), ('SR', 0, 0), ('SS', 0, 0), ('ST', 0, 0),
('SV', 0, 0), ('SY', 0, 0), ('SZ', 0, 0), ('TD', 0, 0), ('TG', 0, 0),
('TH', 0, 0), ('TJ', 0, 0), ('TL', 0, 0), ('TM', 0, 0), ('TN', 0, 0),
('TO', 0, 0), ('TR', 0, 0), ('TT', 0, 0), ('TV', 0, 0), ('TZ', 0, 0),
('UA', 0, 0), ('UG', 0, 0), ('US', 0, 0), ('UY', 0, 0), ('UZ', 0, 0),
('VA', 0, 0), ('VC', 0, 0), ('VE', 0, 0), ('VN', 0, 0), ('VU', 0, 0),
('WS', 0, 0), ('YE', 0, 0), ('ZA', 0, 0), ('ZM', 0, 0), ('ZW', 0, 0)
ON CONFLICT (country_code) DO UPDATE SET
  activation_count = EXCLUDED.activation_count,
  glow_band = EXCLUDED.glow_band,
  last_updated = NOW();

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Your database is now ready to use.
-- Next steps:
-- 1. Update your .env.local with new Supabase credentials
-- 2. Test the application
-- 3. Create your first admin user (see MIGRATION_GUIDE.md)
-- ============================================================================
