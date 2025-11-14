-- Create country_states table
-- This table stores activation counts and glow bands for each country
CREATE TABLE IF NOT EXISTS public.country_states (
  country_code VARCHAR PRIMARY KEY,
  activation_count INTEGER NOT NULL DEFAULT 0 CHECK (activation_count >= 0),
  glow_band INTEGER NOT NULL DEFAULT 0 CHECK (glow_band >= 0 AND glow_band <= 3),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.country_states IS 'Stores activation counts and visual glow bands for each country';
COMMENT ON COLUMN public.country_states.country_code IS 'ISO 3166-1 alpha-2 country code';
COMMENT ON COLUMN public.country_states.activation_count IS 'Number of activations for this country';
COMMENT ON COLUMN public.country_states.glow_band IS 'Visual glow intensity (0-3)';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_country_states_glow_band ON public.country_states(glow_band);
CREATE INDEX IF NOT EXISTS idx_country_states_activation_count ON public.country_states(activation_count);
