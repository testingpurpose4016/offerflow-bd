import { z } from 'zod';

// Request/Response schemas for API contracts

// Offer schemas
export const OfferSchema = z.object({
  id: z.string().uuid(),
  operator: z.string(),
  title: z.string(),
  data_amount: z.string(),
  minutes: z.number().int().min(0),
  validity_days: z.number().int().min(1),
  selling_price: z.number().int().min(1),
  original_price: z.number().int().min(1),
  region: z.string(),
  category: z.string(),
  whatsapp_number: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const NewOfferSchema = OfferSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const UpdateOfferSchema = NewOfferSchema.partial();

// Config schemas
export const ConfigSchema = z.object({
  id: z.string().uuid(),
  key: z.string(),
  value: z.any(), // JSON value
  description: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const NewConfigSchema = ConfigSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Offer listing request
export const OffersListRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  operator: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  min_price: z.number().int().min(0).optional(),
  max_price: z.number().int().min(0).optional(),
  sort_by: z.enum(['created_at', 'selling_price', 'validity_days']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// CSV import schemas
export const CsvOfferSchema = z.object({
  operator: z.string().min(1),
  title: z.string().min(1),
  data_amount: z.string().min(1),
  minutes: z.number().int().min(0).default(0),
  validity_days: z.number().int().min(1),
  selling_price: z.number().int().min(1),
  original_price: z.number().int().min(1).optional(),
  region: z.string().default('Global'),
  category: z.string().default('Data'),
  whatsapp_number: z.string().optional(),
  description: z.string().optional(),
});

export const CsvImportRequestSchema = z.object({
  offers: z.array(CsvOfferSchema),
  validate_only: z.boolean().default(false),
});

// Export types
export type Offer = z.infer<typeof OfferSchema>;
export type NewOffer = z.infer<typeof NewOfferSchema>;
export type UpdateOffer = z.infer<typeof UpdateOfferSchema>;
export type Config = z.infer<typeof ConfigSchema>;
export type NewConfig = z.infer<typeof NewConfigSchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T };
export type OffersListRequest = z.infer<typeof OffersListRequestSchema>;
export type CsvOffer = z.infer<typeof CsvOfferSchema>;
export type CsvImportRequest = z.infer<typeof CsvImportRequestSchema>;