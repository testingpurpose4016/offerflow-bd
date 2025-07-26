import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConfigData {
  operators: string[];
  categories: string[];
  default_whatsapp: string;
  support_phone: string;
  support_email: string;
  company_name: string;
}

export const useConfig = () => {
  const [config, setConfig] = useState<ConfigData>({
    operators: [],
    categories: [],
    default_whatsapp: '',
    support_phone: '',
    support_email: '',
    company_name: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('config')
        .select('key, value');

      if (error) {
        throw error;
      }

      const configMap: any = {};
      data?.forEach(item => {
        configMap[item.key] = item.value;
      });

      setConfig(configMap);
    } catch (err) {
      console.error('Failed to fetch config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    isLoading,
    refreshConfig: fetchConfig,
  };
};