-- Create locker_state table
-- This table stores the global unlock progress state
CREATE TABLE IF NOT EXISTS public.locker_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  energy_percentage NUMERIC NOT NULL DEFAULT 0 CHECK (energy_percentage >= 0 AND energy_percentage <= 100),
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE public.locker_state IS 'Stores global unlock progress state (singleton table)';
COMMENT ON COLUMN public.locker_state.id IS 'Always 1 - ensures single row';
COMMENT ON COLUMN public.locker_state.energy_percentage IS 'Global progress percentage (0-100)';
COMMENT ON COLUMN public.locker_state.is_unlocked IS 'Whether the global goal has been achieved';

-- Insert initial row
INSERT INTO public.locker_state (id, energy_percentage, is_unlocked, last_updated)
VALUES (1, 0, false, NOW())
ON CONFLICT (id) DO NOTHING;
