CREATE OR REPLACE FUNCTION public.decrement_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE name = NEW.product_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;