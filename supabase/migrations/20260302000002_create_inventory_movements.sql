-- 1. Create the inventory_movements table
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    quantity INT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('production', 'adjustment')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Turn on RLS
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Anyone (admin or vendor) can insert their own movements
CREATE POLICY "Enable insert for authenticated users" 
ON public.inventory_movements FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Only Admins can read the movements
CREATE POLICY "Enable read for admins" 
ON public.inventory_movements FOR SELECT 
TO authenticated 
USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid()) = 'admin'
);

-- 4. Trigger to automatically increment product stock
CREATE OR REPLACE FUNCTION public.increment_stock_from_movement()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET stock = stock + NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_increment_stock_from_movement
AFTER INSERT ON public.inventory_movements
FOR EACH ROW
EXECUTE FUNCTION public.increment_stock_from_movement();
