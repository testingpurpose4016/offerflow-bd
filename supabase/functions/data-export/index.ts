import { drizzle } from 'https://esm.sh/drizzle-orm@0.28.6/postgres-js';
import postgres from 'https://esm.sh/postgres@3.3.5';

// Drizzle schema (inline for Edge Functions)
import { pgTable, uuid, text, integer, boolean, timestamp } from 'https://esm.sh/drizzle-orm@0.28.6/pg-core';
import { sql, desc } from 'https://esm.sh/drizzle-orm@0.28.6';

// Schema definition
const offers = pgTable('offers', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  operator: text('operator').notNull(),
  title: text('title').notNull(),
  data_amount: text('data_amount').notNull(),
  minutes: integer('minutes').notNull().default(0),
  validity_days: integer('validity_days').notNull(),
  selling_price: integer('selling_price').notNull(),
  original_price: integer('original_price').notNull(),
  region: text('region').notNull(),
  category: text('category').notNull(),
  whatsapp_number: text('whatsapp_number').notNull(),
  is_active: boolean('is_active').notNull().default(true),
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
    const { action = 'export', format = 'json' } = await req.json();

    // Initialize database connection
    const connectionString = `postgresql://postgres:${Deno.env.get('SUPABASE_DB_PASSWORD')}@db.${Deno.env.get('SUPABASE_PROJECT_REF')}.supabase.co:5432/postgres`;
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { offers } });

    console.log(`Data Export - Action: ${action}, Format: ${format}`);

    switch (action) {
      case 'export': {
        // Get all active offers
        const result = await db
          .select()
          .from(offers)
          .orderBy(desc(offers.created_at));

        if (format === 'csv') {
          // Convert to CSV format
          const headers = [
            'id', 'operator', 'title', 'data_amount', 'minutes', 
            'validity_days', 'selling_price', 'original_price', 
            'region', 'category', 'whatsapp_number', 'is_active', 
            'created_at', 'updated_at'
          ];
          
          const csvRows = [
            headers.join(','),
            ...result.map(offer => 
              headers.map(header => {
                const value = offer[header as keyof typeof offer];
                // Escape CSV values that contain commas or quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
              }).join(',')
            )
          ];

          return new Response(
            csvRows.join('\n'),
            { 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="offers-export.csv"'
              } 
            }
          );
        }

        // Default to JSON format
        return new Response(
          JSON.stringify({
            success: true,
            data: result,
            count: result.length,
            exported_at: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'stats': {
        // Get statistics about offers
        const allOffers = await db.select().from(offers);
        
        const stats = {
          total_offers: allOffers.length,
          active_offers: allOffers.filter(o => o.is_active).length,
          inactive_offers: allOffers.filter(o => !o.is_active).length,
          operators: [...new Set(allOffers.map(o => o.operator))].length,
          categories: [...new Set(allOffers.map(o => o.category))].length,
          regions: [...new Set(allOffers.map(o => o.region))].length,
          avg_price: allOffers.reduce((sum, o) => sum + o.selling_price, 0) / allOffers.length,
          min_price: Math.min(...allOffers.map(o => o.selling_price)),
          max_price: Math.max(...allOffers.map(o => o.selling_price)),
          generated_at: new Date().toISOString()
        };

        return new Response(
          JSON.stringify({ success: true, stats }),
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
    console.error('Error in data-export:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});