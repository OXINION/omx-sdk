-- GeoTriggers 테이블 생성 SQL (OMX Schema)
-- Supabase Database > SQL Editor에서 실행하세요

-- Enable PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create omx schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS omx;

-- Create geotriggers table in omx schema
CREATE TABLE IF NOT EXISTS omx.geotriggers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    coordinates GEOMETRY(POINT, 4326) NOT NULL, -- PostGIS Point type with SRID 4326 (WGS84)
    radius INTEGER NOT NULL, -- radius in meters
    event_type VARCHAR(50) NOT NULL DEFAULT 'enter', -- 'enter', 'exit', 'both'
    event_payload JSONB, -- JSON payload for webhook/event data
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_omx_geotriggers_coordinates ON omx.geotriggers USING GIST (coordinates);
CREATE INDEX IF NOT EXISTS idx_omx_geotriggers_status ON omx.geotriggers (status);
CREATE INDEX IF NOT EXISTS idx_omx_geotriggers_created_at ON omx.geotriggers (created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE omx.geotriggers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to manage their own geotriggers
CREATE POLICY "Allow authenticated users to manage geotriggers" ON omx.geotriggers
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow anon users to read/write (for testing purposes)
-- WARNING: Remove this in production!
CREATE POLICY "Allow anon users to manage geotriggers" ON omx.geotriggers
    FOR ALL USING (auth.role() = 'anon');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION omx.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON omx.geotriggers
    FOR EACH ROW
    EXECUTE FUNCTION omx.handle_updated_at();

-- Insert sample data for testing
INSERT INTO omx.geotriggers (name, coordinates, radius, event_type, event_payload, status)
VALUES 
    ('Seoul Office', ST_SetSRID(ST_MakePoint(127.0276, 37.4979), 4326), 100, 'enter', '{"message": "Welcome to Seoul Office!"}', 'active'),
    ('Busan Branch', ST_SetSRID(ST_MakePoint(129.0756, 35.1796), 4326), 150, 'enter', '{"message": "Welcome to Busan Branch!"}', 'active'),
    ('Test Location', ST_SetSRID(ST_MakePoint(126.9780, 37.5665), 4326), 50, 'both', '{"message": "Test location trigger"}', 'active');

-- Verify the table was created and sample data inserted
SELECT 
    id,
    name,
    ST_AsText(coordinates) as coordinates_text,
    ST_X(coordinates) as longitude,
    ST_Y(coordinates) as latitude,
    radius,
    event_type,
    event_payload,
    status,
    created_at
FROM omx.geotriggers
ORDER BY created_at DESC;
