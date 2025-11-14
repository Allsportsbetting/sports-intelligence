# 📦 Database Files

This folder contains everything needed to set up the database in a new Supabase project.

## Files

### `complete_schema.sql` (13 KB)
**Complete database setup in one file**

Contains:
- All 5 tables
- All 6 functions
- All 8 triggers
- All RLS policies
- All seed data (195 countries)

**Usage:**
1. Open Supabase SQL Editor
2. Copy entire file
3. Paste and run
4. Done!

### `MIGRATION_GUIDE.md` (7 KB)
**Detailed setup instructions**

Includes:
- 3 different setup methods
- Step-by-step instructions
- Verification steps
- Troubleshooting guide
- Post-migration checklist

**Read this if:**
- First time setting up
- Need detailed instructions
- Encountering issues
- Want to understand the process

## Quick Start

**Fastest way to set up database (5 minutes):**

```bash
# 1. Open Supabase Dashboard → SQL Editor
# 2. Copy complete_schema.sql
# 3. Paste and Run
# 4. Verify:
SELECT COUNT(*) FROM country_states;  -- Should return 195
```

## What Gets Created

### Tables (5)
1. **locker_state** - Global unlock progress
2. **country_states** - 195 countries with activation counts
3. **audit_log** - Admin action tracking
4. **users** - User accounts and roles
5. **payments** - Stripe payment tracking

### Functions (6)
1. `calculate_glow_band()` - Auto-calculate visual glow
2. `update_country_timestamp()` - Update timestamps
3. `update_locker_timestamp()` - Update timestamps
4. `update_updated_at_column()` - Generic updater
5. `handle_new_user()` - Auto-create user records
6. `is_admin(user_id)` - Check admin status

### Triggers (8)
- Auto-calculate glow_band on country updates
- Auto-update timestamps on all changes
- Auto-create user records on auth signup

### Security (RLS)
- All tables have Row Level Security enabled
- Public read access for locker and country data
- Admin-only write access for locker and country data
- User-specific access for personal data

### Data (195 countries)
- All countries initialized
- Current activation counts preserved
- Locker state at 2.46%

## Alternative Setup Methods

### Method 1: SQL Editor (Recommended)
See above - fastest and easiest

### Method 2: Supabase CLI
```bash
cd your-project
supabase link --project-ref YOUR_REF
supabase db push
supabase db seed
```

### Method 3: Manual Migrations
Run each file in `../supabase/migrations/` in order

See `MIGRATION_GUIDE.md` for details on each method.

## Verification

After setup, verify everything works:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check countries
SELECT COUNT(*) as total FROM country_states;
SELECT * FROM country_states WHERE activation_count > 0;

-- Check locker
SELECT * FROM locker_state;

-- Check functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' ORDER BY routine_name;
```

## Troubleshooting

### "relation already exists"
Tables already created - you're good!

### "permission denied"
Check Supabase credentials in `.env.local`

### "function does not exist"
Run `complete_schema.sql` again - it's idempotent

### No countries showing
Run seed data:
```sql
-- Copy from supabase/seed.sql and run
```

## Support

- **Quick Start**: See `../DATABASE_SETUP_QUICKSTART.md`
- **Full Guide**: See `MIGRATION_GUIDE.md`
- **Handoff Guide**: See `../HANDOFF_GUIDE.md`

## File Sizes

```
complete_schema.sql:    13 KB  (everything in one file)
MIGRATION_GUIDE.md:      7 KB  (detailed instructions)
README.md:               3 KB  (this file)
```

Total: ~23 KB of database setup files

---

**Ready to set up your database?** Start with `complete_schema.sql`!
