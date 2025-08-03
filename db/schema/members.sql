CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT  NOT NULL,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  university_id TEXT, -- nullable if not from KAU  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);