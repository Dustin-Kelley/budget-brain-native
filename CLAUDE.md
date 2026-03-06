# Budget Brain Native - Claude Code Instructions

## Supabase Commands

### Local Development
- `supabase start` — Start local Supabase stack (requires Docker Desktop running)
- `supabase stop` — Stop local Supabase stack
- `supabase status` — Show local URLs, keys, and container health
- `supabase db reset` — Wipe local DB and re-apply all migrations from `supabase/migrations/`

### Schema Changes
- `supabase db diff -f <migration_name>` — Auto-generate a migration file from local schema changes
- `supabase db push --dry-run` — Preview what migrations would be applied to production
- `supabase db push` — Apply pending migrations to production (linked remote project)

### Workflow
1. All schema changes happen locally, never directly in the production Supabase dashboard
2. Generate migrations with `supabase db diff -f <name>`
3. Test with `supabase db reset`
4. Commit migration files to git
5. Deploy to prod with `supabase db push`

### Type Generation
- After schema changes, regenerate types: `npx supabase gen types typescript --local > types/supabase.ts`

## Environments
- **Local dev** (`npx expo start`): connects to local Supabase via `.env.local`
- **Production** (EAS build): connects to remote Supabase via env vars in `eas.json`

## Key Paths
- `supabase/migrations/` — Version-controlled database migrations
- `supabase/config.toml` — Local Supabase configuration
- `lib/supabase.ts` — Supabase client init (reads from env vars)
- `types/supabase.ts` — Auto-generated database types
- `.env.local` — Local dev env vars (gitignored)
- `.env.production` — Production env var reference (gitignored)
- `eas.json` — EAS build config with production env vars
