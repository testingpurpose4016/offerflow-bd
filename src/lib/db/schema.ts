import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Offers table schema
export const offers = pgTable('offers', {
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

// Config table schema
export const config = pgTable('config', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  key: text('key').notNull(),
  value: text('value').notNull(), // JSON stored as text
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
});

// Type exports for use in application
export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Config = typeof config.$inferSelect;
export type NewConfig = typeof config.$inferInsert;