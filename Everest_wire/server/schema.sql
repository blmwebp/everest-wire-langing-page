CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('general', 'quote')),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT,
  product_category TEXT,
  estimated_quantity TEXT,
  delivery_timeline TEXT,
  certification_requirements TEXT,
  additional_requirements TEXT,
  attachment_name TEXT,
  attachment_mime TEXT,
  attachment_data BYTEA,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
