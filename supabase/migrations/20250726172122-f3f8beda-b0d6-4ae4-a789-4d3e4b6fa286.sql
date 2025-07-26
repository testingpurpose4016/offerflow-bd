-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operator TEXT NOT NULL,
  title TEXT NOT NULL,
  data_amount TEXT NOT NULL,
  minutes INTEGER NOT NULL DEFAULT 0,
  validity_days INTEGER NOT NULL,
  selling_price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create configuration table for rarely changing data
CREATE TABLE public.config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for now, since no auth yet)
CREATE POLICY "Anyone can view active offers" 
ON public.offers 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view config" 
ON public.config 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_config_updated_at
  BEFORE UPDATE ON public.config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample offers data
INSERT INTO public.offers (operator, title, data_amount, minutes, validity_days, selling_price, original_price, region, category, whatsapp_number) VALUES
('GP', '50GB + 1500 Minutes Bundle', '50GB', 1500, 30, 775, 900, 'All Bangladesh', 'combo', '8801712345678'),
('GP', '120GB + 1800 Minutes Bundle', '120GB', 1800, 30, 830, 1000, 'All Bangladesh', 'combo', '8801712345678'),
('Skitto', '5GB Data Pack', '5GB', 0, 7, 160, 200, 'All Bangladesh', 'internet', '8801712345678'),
('Skitto', '10GB Data Pack', '10GB', 0, 15, 240, 300, 'All Bangladesh', 'internet', '8801712345678'),
('Banglalink', '150GB Data Pack', '150GB', 0, 30, 640, 750, 'Dhaka/Chittagong', 'internet', '8801712345678'),
('Airtel', '125GB Data Pack', '125GB', 0, 30, 650, 750, 'All Bangladesh', 'internet', '8801712345678'),
('Robi', '5GB Data Pack', '5GB', 0, 7, 110, 150, 'All Bangladesh', 'internet', '8801712345678');

-- Insert configuration data
INSERT INTO public.config (key, value, description) VALUES
('operators', '["GP", "Robi", "Banglalink", "Airtel", "Skitto"]', 'List of available operators'),
('categories', '["all", "combo", "internet", "minutes"]', 'List of offer categories'),
('default_whatsapp', '"8801712345678"', 'Default WhatsApp number for orders'),
('support_phone', '"+880171234567"', 'Customer support phone number'),
('support_email', '"support@realdeals.com"', 'Customer support email'),
('company_name', '"রিয়েলদের সিম অফার"', 'Company name in Bengali');

-- Create indexes for better performance
CREATE INDEX idx_offers_operator ON public.offers(operator);
CREATE INDEX idx_offers_category ON public.offers(category);
CREATE INDEX idx_offers_is_active ON public.offers(is_active);
CREATE INDEX idx_config_key ON public.config(key);