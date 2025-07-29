import { supabase } from '@/integrations/supabase/client';
import type { 
  ApiResponse, 
  Offer, 
  Config, 
  OffersListRequest,
  CsvImportRequest 
} from './contracts';

// API service layer for clean data fetching
export class ApiService {
  // Offers API
  static async getOffers(params?: Partial<OffersListRequest>): Promise<ApiResponse<Offer[]>> {
    try {
      const { data, error } = await supabase.functions.invoke('offers-management', {
        body: { action: 'list', ...params }
      });

      if (error) throw error;
      
      return {
        success: true,
        data: data?.offers || [],
        message: 'Offers fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch offers'
      };
    }
  }

  static async getOffer(id: string): Promise<ApiResponse<Offer>> {
    try {
      const { data, error } = await supabase.functions.invoke('offers-management', {
        body: { action: 'get', id }
      });

      if (error) throw error;
      
      return {
        success: true,
        data: data?.offer,
        message: 'Offer fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch offer'
      };
    }
  }

  // Config API
  static async getConfig(): Promise<ApiResponse<Record<string, any>>> {
    try {
      const { data, error } = await supabase.functions.invoke('config-management', {
        body: { action: 'get' }
      });

      if (error) throw error;
      
      return {
        success: true,
        data: data?.config || {},
        message: 'Config fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch config'
      };
    }
  }

  // CSV Import API
  static async importCsv(csvData: CsvImportRequest): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase.functions.invoke('csv-import', {
        body: csvData
      });

      if (error) throw error;
      
      return {
        success: true,
        data: data,
        message: 'CSV imported successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import CSV'
      };
    }
  }

  static async validateCsv(csvData: CsvImportRequest): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase.functions.invoke('csv-import', {
        body: { ...csvData, validate_only: true }
      });

      if (error) throw error;
      
      return {
        success: true,
        data: data,
        message: 'CSV validated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate CSV'
      };
    }
  }

  // Export API
  static async exportData(): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase.functions.invoke('data-export', {
        body: { action: 'export' }
      });

      if (error) throw error;
      
      return {
        success: true,
        data: data,
        message: 'Data exported successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export data'
      };
    }
  }
}