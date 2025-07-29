import { drizzle } from 'https://esm.sh/drizzle-orm@0.28.6/postgres-js';
import postgres from 'https://esm.sh/postgres@3.3.5';

// Drizzle schema (inline for Edge Functions)
import { pgTable, uuid, text, integer, boolean, timestamp } from 'https://esm.sh/drizzle-orm@0.28.6/pg-core';
import { sql } from 'https://esm.sh/drizzle-orm@0.28.6';

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
    const { offers: csvOffers, validate_only = false } = await req.json();

    if (!csvOffers || !Array.isArray(csvOffers)) {
      return new Response(
        JSON.stringify({ error: 'Invalid CSV data format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize database connection
    const connectionString = `postgresql://postgres:${Deno.env.get('SUPABASE_DB_PASSWORD')}@db.${Deno.env.get('SUPABASE_PROJECT_REF')}.supabase.co:5432/postgres`;
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { offers } });

    console.log(`CSV Import - ${validate_only ? 'Validation' : 'Import'} - ${csvOffers.length} offers`);

    // Validation
    const validationErrors: string[] = [];
    const validOffers: any[] = [];

    for (let i = 0; i < csvOffers.length; i++) {
      const offer = csvOffers[i];
      const rowNumber = i + 1;

      // Validate required fields
      if (!offer.operator) validationErrors.push(`Row ${rowNumber}: Operator is required`);
      if (!offer.title) validationErrors.push(`Row ${rowNumber}: Title is required`);
      if (!offer.data_amount) validationErrors.push(`Row ${rowNumber}: Data amount is required`);
      if (!offer.validity_days || offer.validity_days < 1) validationErrors.push(`Row ${rowNumber}: Validity days must be >= 1`);
      if (!offer.selling_price || offer.selling_price < 1) validationErrors.push(`Row ${rowNumber}: Selling price must be >= 1`);

      // Set defaults
      const processedOffer = {
        operator: offer.operator?.trim(),
        title: offer.title?.trim(),
        data_amount: offer.data_amount?.trim(),
        minutes: offer.minutes || 0,
        validity_days: offer.validity_days,
        selling_price: offer.selling_price,
        original_price: offer.original_price || offer.selling_price,
        region: offer.region?.trim() || 'Global',
        category: offer.category?.trim() || 'Data',
        whatsapp_number: offer.whatsapp_number?.trim() || '',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (validationErrors.length === 0) {
        validOffers.push(processedOffer);
      }
    }

    // If validation only, return validation results
    if (validate_only) {
      return new Response(
        JSON.stringify({
          valid: validationErrors.length === 0,
          errors: validationErrors,
          valid_count: validOffers.length,
          total_count: csvOffers.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          errors: validationErrors,
          valid_count: validOffers.length,
          total_count: csvOffers.length
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert valid offers
    const result = await db
      .insert(offers)
      .values(validOffers)
      .returning();

    console.log(`Successfully imported ${result.length} offers`);

    return new Response(
      JSON.stringify({
        success: true,
        imported_count: result.length,
        total_count: csvOffers.length,
        offers: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in csv-import:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});