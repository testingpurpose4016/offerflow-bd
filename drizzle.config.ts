import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: `postgresql://postgres:${process.env.DB_PASSWORD}@db.zpsujubgenvmzzetfpac.supabase.co:5432/postgres`,
  },
  verbose: true,
  strict: true,
} satisfies Config;