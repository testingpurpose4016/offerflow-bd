import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection for Edge Functions
export const createDbClient = (connectionString: string) => {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
};

// For use in Edge Functions - this will be used only in Deno environment
export const getDbClient = () => {
  // @ts-ignore - Deno is available in Edge Functions environment
  const connectionString = `postgresql://postgres:${Deno.env.get('SUPABASE_DB_PASSWORD')}@db.${Deno.env.get('SUPABASE_PROJECT_REF')}.supabase.co:5432/postgres`;
  return createDbClient(connectionString);
};

export type DbClient = ReturnType<typeof createDbClient>;