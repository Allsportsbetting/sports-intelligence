-- ============================================================================
-- Migration: Add Auto Energy Calculation
-- Created: 2025-11-05
-- Description: Automatically calculates energy_percentage based on total
--              country activations. Target: 1000 activations = 100%
-- ============================================================================

-- Create function to auto-update energy percentage based on country activations
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

-- Create trigger to run after country_states updates
DROP TRIGGER IF EXISTS trigger_auto_update_energy ON public.country_states;
CREATE TRIGGER trigger_auto_update_energy
  AFTER INSERT OR UPDATE OR DELETE ON public.country_states
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.auto_update_energy_percentage();

COMMENT ON TRIGGER trigger_auto_update_energy ON public.country_states IS 
  'Triggers automatic energy percentage calculation whenever country activations change';
