import { ApiService } from './api/service';
import type { Offer } from './api/contracts';

// Data loader for server-side fetching - makes components truly dumb
export class DataLoader {
  static async getOffersData(params?: any) {
    const [offersResponse, configResponse] = await Promise.all([
      ApiService.getOffers(params),
      ApiService.getConfig()
    ]);

    return {
      offers: offersResponse.success ? offersResponse.data || [] : [],
      config: configResponse.success ? configResponse.data || {} : {},
      error: !offersResponse.success ? offersResponse.error : !configResponse.success ? configResponse.error : null
    };
  }

  static async getAdminData() {
    const configResponse = await ApiService.getConfig();
    
    return {
      config: configResponse.success ? configResponse.data || {} : {},
      error: !configResponse.success ? configResponse.error : null
    };
  }
}

// Simple props interfaces for components
export interface OffersPageProps {
  offers: Offer[];
  config: Record<string, any>;
  error?: string | null;
}

export interface AdminPageProps {
  config: Record<string, any>;
  error?: string | null;
}