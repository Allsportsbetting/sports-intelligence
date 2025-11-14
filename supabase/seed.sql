-- ============================================================================
-- SEED DATA FOR GLOBAL UNLOCK APP
-- ============================================================================
-- This file contains initial data for the database
-- Last updated: 2025-11-05
-- Current state:
--   - Total activations: 105
--   - Energy percentage: 10.50% (auto-calculated by trigger)
--   - Countries with activations: 9
-- ============================================================================

-- Seed locker_state
-- Note: energy_percentage is auto-calculated by trigger when countries are inserted
INSERT INTO public.locker_state (id, energy_percentage, is_unlocked, last_updated)
VALUES (1, 10.50, false, NOW())
ON CONFLICT (id) DO UPDATE SET
  energy_percentage = EXCLUDED.energy_percentage,
  is_unlocked = EXCLUDED.is_unlocked,
  last_updated = NOW();

-- Seed country_states with all 195 countries
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

-- Note: Users and payments tables will be populated as users sign up and make payments
-- No seed data needed for audit_log as it tracks admin actions
