CREATE TABLE supplier_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone_number TEXT,
  address TEXT,
  country TEXT,
  website TEXT,

  -- Supplier Classification
  supplier_type TEXT CHECK (supplier_type IN ('manufacturer', 'distributor', 'service_provider')),
  category TEXT,  -- e.g., "Electronics", "Chemicals", "Packaging"
  product_keywords TEXT[],  -- e.g., ['laptop', 'hub', 'usb']
  
  -- Capabilities & Compliance
  product_certifications TEXT[],  -- e.g., ['ISO', 'CE', 'RoHS']
  min_order_quantity INTEGER,
  delivery_regions TEXT[],  -- e.g., ['North America', 'Europe', 'Asia']
  average_lead_time INTERVAL,  -- e.g., '14 days'
  
  -- Pricing Info
  currency TEXT DEFAULT 'USD',
  typical_unit_price NUMERIC,
  negotiation_flexibility TEXT CHECK (negotiation_flexibility IN ('low', 'medium', 'high')),
  
  -- Communication
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'both')) DEFAULT 'email',
  active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
