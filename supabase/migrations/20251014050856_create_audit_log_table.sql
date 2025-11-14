-- Create audit_log table
-- This table tracks all admin actions for accountability
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email VARCHAR NOT NULL,
  action_type VARCHAR NOT NULL CHECK (action_type IN ('country_increment', 'country_set', 'energy_increment', 'energy_set')),
  subject VARCHAR NOT NULL,
  delta_or_value TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.audit_log IS 'Audit trail of all admin actions';
COMMENT ON COLUMN public.audit_log.admin_email IS 'Email of admin who performed the action';
COMMENT ON COLUMN public.audit_log.action_type IS 'Type of action performed';
COMMENT ON COLUMN public.audit_log.subject IS 'What was modified (country code or "global")';
COMMENT ON COLUMN public.audit_log.delta_or_value IS 'Change amount or new value';

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_email ON public.audit_log(admin_email);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action_type ON public.audit_log(action_type);
