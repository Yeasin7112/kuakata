
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (v_users)
CREATE TABLE IF NOT EXISTS v_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER',
    type TEXT, -- For Vendors: 'HOTEL' or 'RESTAURANT'
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Places Table (v_places)
CREATE TABLE IF NOT EXISTS v_places (
    id TEXT PRIMARY KEY,
    "vendorId" TEXT,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    category TEXT NOT NULL, -- 'PLACE', 'HOTEL', 'RESTAURANT'
    "descriptionBn" TEXT,
    "descriptionEn" TEXT,
    image TEXT,
    location JSONB, -- {lat: 0, lng: 0, address: ""}
    "bestTime" TEXT,
    "priceRange" TEXT,
    contact TEXT,
    facilities TEXT[],
    rating NUMERIC DEFAULT 4.5
);

-- 3. Products Table (v_products)
CREATE TABLE IF NOT EXISTS v_products (
    id TEXT PRIMARY KEY,
    "vendorId" TEXT REFERENCES v_users(id) ON DELETE CASCADE,
    "nameBn" TEXT,
    "nameEn" TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT,
    type TEXT, -- 'ROOM' or 'DISH'
    "descriptionEn" TEXT,
    "descriptionBn" TEXT,
    available BOOLEAN DEFAULT TRUE
);

-- 4. Bookings Table (v_bookings)
CREATE TABLE IF NOT EXISTS v_bookings (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    "vendorId" TEXT,
    "productId" TEXT,
    "productName" TEXT,
    "totalPrice" NUMERIC,
    commission NUMERIC,
    status TEXT DEFAULT 'PENDING',
    date TEXT,
    "checkIn" TEXT,
    "checkOut" TEXT,
    quantity INTEGER DEFAULT 1
);

-- --- DISABLE RLS FOR RAPID DEVELOPMENT ---
-- This ensures the anon key can perform all operations without complex policies
ALTER TABLE v_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE v_places DISABLE ROW LEVEL SECURITY;
ALTER TABLE v_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE v_bookings DISABLE ROW LEVEL SECURITY;

-- --- SEED DATA ---
INSERT INTO v_users (id, name, email, password, role, type)
VALUES ('admin-1', 'Admin', 'admin@ourkuakata.com', 'admin123', 'SUPER_ADMIN', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO v_places (id, "nameBn", "nameEn", category, "descriptionBn", "descriptionEn", image, location, rating)
VALUES 
('p1', 'কুয়াকাটা সমুদ্র সৈকত', 'Kuakata Sea Beach', 'PLACE', 'সূর্যোদয় এবং সূর্যাস্ত দেখার জন্য বিখ্যাত।', 'Famous for both sunrise and sunset.', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800', '{"lat": 21.8122, "lng": 90.1213, "address": "Kuakata Beach"}', 4.9)
ON CONFLICT (id) DO NOTHING;
