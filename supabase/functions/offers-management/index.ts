import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { drizzle } from 'https://esm.sh/drizzle-orm@0.28.6/postgres-js';
import postgres from 'https://esm.sh/postgres@3.3.5';

// Drizzle schema (inline for Edge Functions)
import { pgTable, uuid, text, integer, boolean, timestamp } from 'https://esm.sh/drizzle-orm@0.28.6/pg-core';
import { sql, desc, asc, eq, and, gte, lte, ilike } from 'https://esm.sh/drizzle-orm@0.28.6';

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
    const { action, ...params } = await req.json();

    // Initialize database connection
    const connectionString = `postgresql://postgres:${Deno.env.get('SUPABASE_DB_PASSWORD')}@db.${Deno.env.get('SUPABASE_PROJECT_REF')}.supabase.co:5432/postgres`;
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { offers } });

    console.log(`Offers Management - Action: ${action}`, params);

    switch (action) {
      case 'list': {
        const {
          page = 1,
          limit = 20,
          operator,
          category,
          region,
          min_price,
          max_price,
          sort_by = 'created_at',
          sort_order = 'desc'
        } = params;

        // Build query conditions
        const conditions = [eq(offers.is_active, true)];
        
        if (operator) conditions.push(ilike(offers.operator, `%${operator}%`));
        if (category) conditions.push(ilike(offers.category, `%${category}%`));
        if (region && region !== 'All Bangladesh') conditions.push(ilike(offers.region, `%${region}%`));
        if (min_price) conditions.push(gte(offers.selling_price, min_price));
        if (max_price) conditions.push(lte(offers.selling_price, max_price));

        // Build order by
        const orderBy = sort_order === 'desc' 
          ? desc(offers[sort_by as keyof typeof offers._.columns]) 
          : asc(offers[sort_by as keyof typeof offers._.columns]);

        // Execute query
        const result = await db
          .select()
          .from(offers)
          .where(and(...conditions))
          .orderBy(orderBy)
          .limit(limit)
          .offset((page - 1) * limit);

        return new Response(
          JSON.stringify({ offers: result }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get': {
        const { id } = params;
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'Offer ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const result = await db
          .select()
          .from(offers)
          .where(eq(offers.id, id))
          .limit(1);

        if (result.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Offer not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ offer: result[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        const { offer } = params;
        if (!offer) {
          return new Response(
            JSON.stringify({ error: 'Offer data is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const result = await db
          .insert(offers)
          .values({
            ...offer,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();

        return new Response(
          JSON.stringify({ offer: result[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { id, offer } = params;
        if (!id || !offer) {
          return new Response(
            JSON.stringify({ error: 'Offer ID and data are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const result = await db
          .update(offers)
          .set({
            ...offer,
            updated_at: new Date(),
          })
          .where(eq(offers.id, id))
          .returning();

        if (result.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Offer not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ offer: result[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { id } = params;
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'Offer ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Soft delete by setting is_active to false
        const result = await db
          .update(offers)
          .set({
            is_active: false,
            updated_at: new Date(),
          })
          .where(eq(offers.id, id))
          .returning();

        if (result.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Offer not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ message: 'Offer deleted successfully' }),
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
    console.error('Error in offers-management:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});