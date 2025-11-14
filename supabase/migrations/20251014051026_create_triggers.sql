-- Create database triggers

-- Trigger: Calculate glow_band on country_states insert/update
CREATE TRIGGER trigger_calculate_glow_band
  BEFORE INSERT OR UPDATE ON public.country_states
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_glow_band();

-- Trigger: Update timestamp on country_states update
CREATE TRIGGER trigger_update_country_timestamp
  BEFORE UPDATE ON public.country_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_country_timestamp();

-- Trigger: Update timestamp on locker_state update
CREATE TRIGGER trigger_update_locker_timestamp
  BEFORE UPDATE ON public.locker_state
  FOR EACH ROW
  EXECUTE FUNCTION public.update_locker_timestamp();

-- Trigger: Update updated_at on users update
CREATE TRIGGER trigger_update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Update updated_at on payments update
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Handle new auth user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comments
COMMENT ON TRIGGER trigger_calculate_glow_band ON public.country_states IS 'Automatically calculates glow_band based on activation_count';
COMMENT ON TRIGGER trigger_update_country_timestamp ON public.country_states IS 'Updates last_updated timestamp on changes';
COMMENT ON TRIGGER trigger_update_locker_timestamp ON public.locker_state IS 'Updates last_updated timestamp on changes';
COMMENT ON TRIGGER trigger_update_users_updated_at ON public.users IS 'Updates updated_at timestamp on changes';
COMMENT ON TRIGGER update_payments_updated_at ON public.payments IS 'Updates updated_at timestamp on changes';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Creates user record when auth user is created';
