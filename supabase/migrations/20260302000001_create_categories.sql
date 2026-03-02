-- 1. Create the categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Turn on RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- All authenticated users (Admin and Vendor) can read categories
CREATE POLICY "Enable read access for all authenticated users" 
ON public.categories FOR SELECT 
TO authenticated 
USING (true);

-- Only Admins can insert, update, or delete categories
CREATE POLICY "Enable insert for admins only" 
ON public.categories FOR INSERT 
TO authenticated 
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Enable update for admins only" 
ON public.categories FOR UPDATE 
TO authenticated 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Enable delete for admins only" 
ON public.categories FOR DELETE 
TO authenticated 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- 4. Insert Default Categories
INSERT INTO public.categories (slug, label) VALUES
('cakes', 'Tortas'),
('cupcakes', 'Cupcakes'),
('beverages', 'Bebidas'),
('custom', 'Personalizado')
ON CONFLICT (slug) DO NOTHING;
