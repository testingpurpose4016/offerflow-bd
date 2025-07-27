// App Constants
export const APP_CONFIG = {
  name: "রিয়েলদের সিম অফার",
  tagline: "সবচেয়ে কম দামে সিম অফার",
  defaultBalance: 1250,
  maxComparisonItems: 3,
  defaultWhatsApp: "+8801712345678",
  supportPhone: "+880171234567",
  supportEmail: "support@realdeals.com",
  companyName: "Real Deals BD",
} as const;

// Operators
export const OPERATORS = {
  GP: "GP",
  ROBI: "Robi", 
  BANGLALINK: "Banglalink",
  AIRTEL: "Airtel",
  SKITTO: "Skitto",
} as const;

export const OPERATOR_COLORS = {
  [OPERATORS.GP]: "bg-green-600",
  [OPERATORS.ROBI]: "bg-orange-600", 
  [OPERATORS.BANGLALINK]: "bg-blue-600",
  [OPERATORS.AIRTEL]: "bg-red-600",
  [OPERATORS.SKITTO]: "bg-purple-600",
} as const;

// Categories
export const CATEGORIES = {
  ALL: "all",
  DATA: "data",
  COMBO: "combo",
  MINUTES: "minutes",
  SMS: "sms",
} as const;

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: "newest",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high", 
  DATA_HIGH: "data-high",
  VALIDITY_LOW: "validity-low",
  VALIDITY_HIGH: "validity-high",
} as const;

// Validity Filters
export const VALIDITY_FILTERS = {
  ALL: "all",
  WEEK: "7",
  MONTH: "30",
  LONG: "60+",
} as const;

// Price Ranges
export const PRICE_RANGES = {
  MIN: 0,
  MAX: 2000,
  DEFAULT: [0, 2000] as [number, number],
} as const;

// Regions
export const REGIONS = {
  ALL: "All Bangladesh",
  DHAKA: "Dhaka",
  CHITTAGONG: "Chittagong", 
  SYLHET: "Sylhet",
  RAJSHAHI: "Rajshahi",
  KHULNA: "Khulna",
  BARISAL: "Barisal",
  RANGPUR: "Rangpur",
  MYMENSINGH: "Mymensingh",
} as const;

// CSV Upload Constants
export const CSV_HEADERS = {
  REQUIRED: [
    "operator",
    "title", 
    "data_amount",
    "selling_price",
    "validity_days"
  ],
  OPTIONAL: [
    "minutes",
    "original_price",
    "region",
    "category",
    "whatsapp_number",
    "description"
  ],
  ALL: [
    "operator",
    "title",
    "data_amount", 
    "minutes",
    "validity_days",
    "selling_price",
    "original_price",
    "region",
    "category",
    "whatsapp_number",
    "description"
  ]
} as const;

// CSV Template for Download
export const CSV_TEMPLATE = {
  headers: CSV_HEADERS.ALL,
  sampleData: [
    {
      operator: "GP",
      title: "50GB + 1500 Minutes Bundle",
      data_amount: "50GB",
      minutes: 1500,
      validity_days: 30,
      selling_price: 775,
      original_price: 900,
      region: "All Bangladesh",
      category: "combo",
      whatsapp_number: "+8801712345678",
      description: "Best value combo pack"
    },
    {
      operator: "Robi",
      title: "25GB Data Pack",
      data_amount: "25GB", 
      minutes: 0,
      validity_days: 30,
      selling_price: 450,
      original_price: 500,
      region: "All Bangladesh",
      category: "data",
      whatsapp_number: "+8801712345678",
      description: "High speed data pack"
    }
  ]
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  CSV_INVALID_FORMAT: "Invalid CSV format. Please check the file structure.",
  CSV_MISSING_HEADERS: "Missing required headers in CSV file.",
  CSV_INVALID_DATA: "Invalid data in CSV file. Please check the values.",
  UPLOAD_FAILED: "Upload failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Unauthorized access. Please login again.",
} as const;

// Success Messages  
export const SUCCESS_MESSAGES = {
  CSV_UPLOADED: "CSV file uploaded successfully!",
  OFFERS_SAVED: "Offers saved to database successfully!",
  DATA_EXPORTED: "Data exported successfully!",
  FILTERS_CLEARED: "All filters cleared successfully!",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  OFFERS: "/api/offers",
  CONFIG: "/api/config", 
  UPLOAD: "/api/upload",
  EXPORT: "/api/export",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: "sim-offers-favorites",
  COMPARISON: "sim-offers-comparison", 
  FILTERS: "sim-offers-filters",
  THEME: "sim-offers-theme",
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_PRICE: 1,
  MAX_PRICE: 10000,
  MIN_VALIDITY: 1,
  MAX_VALIDITY: 365,
  MIN_DATA: 0,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;
