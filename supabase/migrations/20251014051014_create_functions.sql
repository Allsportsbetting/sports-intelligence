-- Create database functions

-- Function: calculate_glow_band
-- Automatically calculates glow_band based on activation_count
CREATE OR REPLACE FUNCTION public.calculate_glow_band()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Calculate glow_band based on activation_count thresholds
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
-- Updates last_updated timestamp for country_states
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
-- Updates last_updated timestamp for locker_state
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
-- Generic function to update updated_at column
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
-- Automatically creates user record when auth user is created
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
-- Checks if a user has admin role
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

-- Add comments
COMMENT ON FUNCTION public.calculate_glow_band() IS 'Trigger function to calculate glow_band based on activation_count';
COMMENT ON FUNCTION public.update_country_timestamp() IS 'Trigger function to update last_updated timestamp for country_states';
COMMENT ON FUNCTION public.update_locker_timestamp() IS 'Trigger function to update last_updated timestamp for locker_state';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Generic trigger function to update updated_at column';
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to create user record when auth user is created';
COMMENT ON FUNCTION public.is_admin(UUID) IS 'Check if user has admin role';
