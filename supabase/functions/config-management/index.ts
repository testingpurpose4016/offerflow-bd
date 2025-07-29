import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { drizzle } from 'https://esm.sh/drizzle-orm@0.28.6/postgres-js';
import postgres from 'https://esm.sh/postgres@3.3.5';

// Drizzle schema (inline for Edge Functions)
import { pgTable, uuid, text, timestamp } from 'https://esm.sh/drizzle-orm@0.28.6/pg-core';
import { sql, eq } from 'https://esm.sh/drizzle-orm@0.28.6';

// Schema definition
const config = pgTable('config', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  key: text('key').notNull(),
  value: text('value').notNull(), // JSON stored as text
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    // Initialize database connection
    const connectionString = `postgresql://postgres:${Deno.env.get('SUPABASE_DB_PASSWORD')}@db.${Deno.env.get('SUPABASE_PROJECT_REF')}.supabase.co:5432/postgres`;
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { config } });

    console.log(`Config Management - Action: ${action}`, params);

    switch (action) {
      case 'get': {
        // Get all config values and transform to key-value object
        const result = await db.select().from(config);
        
        const configMap: Record<string, any> = {};
        result.forEach(item => {
          try {
            // Try to parse as JSON, fallback to string
            configMap[item.key] = JSON.parse(item.value);
          } catch {
            configMap[item.key] = item.value;
          }
        });

        return new Response(
          JSON.stringify({ config: configMap }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'set': {
        const { key, value, description } = params;
        if (!key || value === undefined) {
          return new Response(
            JSON.stringify({ error: 'Key and value are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const valueString = typeof value === 'string' ? value : JSON.stringify(value);

        // Upsert config value
        const result = await db
          .insert(config)
          .values({
            key,
            value: valueString,
            description,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .onConflictDoUpdate({
            target: config.key,
            set: {
              value: valueString,
              description,
              updated_at: new Date(),
            },
          })
          .returning();

        return new Response(
          JSON.stringify({ config: result[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { key } = params;
        if (!key) {
          return new Response(
            JSON.stringify({ error: 'Key is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const result = await db
          .delete(config)
          .where(eq(config.key, key))
          .returning();

        if (result.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Config key not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ message: 'Config deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in config-management:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});