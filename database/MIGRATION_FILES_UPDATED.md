# ✅ Migration Files Updated - 2025-11-05

## Summary

All migration files and schema have been updated to match your current Supabase database state, including the new auto-energy calculation feature.

---

## What Was Updated

### 1. New Migration File Created

**File**: `supabase/migrations/20251105154500_add_auto_energy_calculation.sql`

**What it does**:
- Creates `auto_update_energy_percentage()` function
- Creates trigger `trigger_auto_update_energy` on country_states table
- Automatically calculates energy_percentage based on total activations
- Target: 1000 activations = 100%

**When to use**: Run this migration on any new database to enable auto-energy calculation

### 2. Seed Data Updated

**File**: `supabase/seed.sql`

**Changes**:
- Updated locker_state: `energy_percentage = 10.50` (was 2.46)
- Updated country activations to match current state:
  - AU: 5 activations
  - BD: 6 activations
  - CA: 10 activations
  - **DE: 25 activations** (NEW)
  - **FR: 20 activations** (updated from 0)
  - GB: 6 activations
  - **IN: 12 activations** (NEW)
  - KR: 15 activations
  - RU: 6 activations
- Total: 105 activations = 10.50%

### 3. Complete Schema Updated

**File**: `database/complete_schema.sql`

**Changes**:
- Added `auto_update_energy_percentage()` function
- Added `trigger_auto_update_energy` trigger
- Updated seed data to match current state
- Added comments explaining auto-calculation

---

## Current Database State

### Tables (5)
1. **locker_state**: 1 row
   - energy_percentage: 10.50%
   - is_unlocked: false
   
2. **country_states**: 195 rows
   - 9 countries with activations
   - 186 countries with 0 activations
   
3. **audit_log**: 3 rows
   - Tracks admin actions
   
4. **users**: 1 row
   - Admin user created
   
5. **payments**: 5 rows
   - 2 succeeded payments (synced)
   - Other payment records

### Functions (7)
1. `calculate_glow_band()` - Auto-calculates visual glow (0-3)
2. `update_country_timestamp()` - Updates last_updated on country changes
3. `update_locker_timestamp()` - Updates last_updated on locker changes
4. `update_updated_at_column()` - Generic timestamp updater
5. `handle_new_user()` - Creates user record on auth signup
6. `is_admin(user_id)` - Checks if user has admin role
7. **`auto_update_energy_percentage()`** - Auto-calculates energy % (NEW)

### Triggers (7)
1. `trigger_calculate_glow_band` - Auto-calculate glow on country update
2. `trigger_update_country_timestamp` - Update timestamp on country change
3. `trigger_update_locker_timestamp` - Update timestamp on locker change
4. `trigger_update_users_updated_at` - Update timestamp on user change
5. `update_payments_updated_at` - Update timestamp on payment change
6. `on_auth_user_created` - Create user record on auth signup
7. **`trigger_auto_update_energy`** - Auto-update energy % on country change (NEW)

---

## Migration File Structure

```
supabase/migrations/
├── 20251014050832_create_locker_state_table.sql
├── 20251014050843_create_country_states_table.sql
├── 20251014050856_create_audit_log_table.sql
├── 20251014092119_create_users_table.sql
├── 20251104180427_create_payments_table.sql
├── 20251014051014_create_functions.sql
├── 20251014050923_enable_rls.sql
├── 20251014051026_create_triggers.sql
└── 20251105154500_add_auto_energy_calculation.sql  ← NEW
```

---

## How to Use These Files

### For New Database Setup

**Option 1: Complete Schema (Fastest)**
```sql
-- Run in Supabase SQL Editor
-- Copy entire content of database/complete_schema.sql
-- Paste and execute
```

**Option 2: Individual Migrations (Recommended for Production)**
```bash
# Using Supabase CLI
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase db seed
```

**Option 3: Manual Migration**
Run each file in order:
1. `20251014050832_create_locker_state_table.sql`
2. `20251014050843_create_country_states_table.sql`
3. `20251014050856_create_audit_log_table.sql`
4. `20251014092119_create_users_table.sql`
5. `20251104180427_create_payments_table.sql`
6. `20251014051014_create_functions.sql`
7. `20251014050923_enable_rls.sql`
8. `20251014051026_create_triggers.sql`
9. `20251105154500_add_auto_energy_calculation.sql` ← NEW
10. `seed.sql`

### For Existing Database (Add Auto-Energy Feature)

If you already have a database and just want to add the auto-energy calculation:

```sql
-- Run only the new migration
-- Copy content of: supabase/migrations/20251105154500_add_auto_energy_calculation.sql
-- Paste in SQL Editor and execute
```

Then manually trigger the calculation:
```sql
-- Trigger initial calculation
UPDATE public.country_states 
SET activation_count = activation_count 
WHERE country_code = 'US';
```

---

## Verification Queries

After running migrations, verify everything is set up correctly:

```sql
-- 1. Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
-- Expected: 5 tables

-- 2. Check all functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;
-- Expected: 7 functions

-- 3. Check all triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;
-- Expected: 7 triggers

-- 4. Check current state
SELECT 
  (SELECT COUNT(*) FROM country_states) as total_countries,
  (SELECT SUM(activation_count) FROM country_states) as total_activations,
  (SELECT energy_percentage FROM locker_state WHERE id = 1) as energy_percentage,
  (SELECT is_unlocked FROM locker_state WHERE id = 1) as is_unlocked;
-- Expected: 195 countries, 105 activations, 10.50%, false

-- 5. Test auto-calculation
-- Update a country and check if energy_percentage updates
UPDATE country_states SET activation_count = 10 WHERE country_code = 'US';
SELECT energy_percentage FROM locker_state WHERE id = 1;
-- Should show 11.50% (115 / 1000 * 100)

-- Revert test
UPDATE country_states SET activation_count = 0 WHERE country_code = 'US';
```

---

## Migration History

### 2025-11-05 (This Update)
- ✅ Added auto-energy calculation function and trigger
- ✅ Updated seed data to match current database state
- ✅ Updated complete schema with new features
- ✅ Created migration file for auto-energy feature

### 2025-11-04
- ✅ Created payments table migration
- ✅ Added payment tracking functionality

### 2025-10-14
- ✅ Initial database setup
- ✅ Created all core tables
- ✅ Created functions and triggers
- ✅ Enabled RLS policies
- ✅ Added seed data

---

## Files Summary

### Migration Files (9)
- All timestamped and ordered
- Can be run sequentially
- Idempotent (safe to run multiple times)

### Seed File (1)
- Contains current state data
- 195 countries with activations
- Initial locker state

### Complete Schema (1)
- Single file with everything
- Fastest for new setup
- Includes all features

### Documentation (3)
- `MIGRATION_GUIDE.md` - Detailed migration instructions
- `MIGRATION_SUMMARY.md` - Overview of all migrations
- `MIGRATION_FILES_UPDATED.md` - This file

---

## Next Steps

### For Moving to New Database

1. **Create new Supabase project**
2. **Run complete schema**:
   ```sql
   -- Copy database/complete_schema.sql
   -- Paste in SQL Editor
   -- Execute
   ```
3. **Verify setup** using queries above
4. **Create admin user**
5. **Update .env.local** with new credentials
6. **Test application**

### For Version Control

All migration files are now in sync with your database. Commit these changes:

```bash
git add supabase/migrations/
git add supabase/seed.sql
git add database/complete_schema.sql
git add database/MIGRATION_FILES_UPDATED.md
git commit -m "Update migrations to match current database state"
```

---

## Important Notes

### Auto-Energy Calculation
- **Target**: 1000 activations = 100%
- **Formula**: `(total_activations / 1000) * 100`
- **Trigger**: Runs automatically on any country_states change
- **To change target**: Edit the function and set `target_activations` to desired value

### Data Preservation
- All current data is preserved in seed file
- Migration files are additive (don't delete data)
- Safe to run on existing databases

### Idempotency
- All migrations use `IF NOT EXISTS` or `ON CONFLICT`
- Safe to run multiple times
- Won't fail if objects already exist

---

## 🎉 Summary

Your migration files are now:
- ✅ Up to date with current database
- ✅ Include auto-energy calculation
- ✅ Ready for new database setup
- ✅ Version controlled and documented
- ✅ Easy to move to new Supabase project

**Total activations**: 105
**Energy percentage**: 10.50%
**Target**: 1000 activations = 100%
**Remaining**: 895 activations to unlock

---

**Last updated**: November 5, 2025
**Database**: qempxusaaswkhzmrvmat (country_db)
**Status**: ✅ All migrations synced
