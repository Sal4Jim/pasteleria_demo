-- Añadir columna stock a products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0;

-- Función para descontar stock al insertar order_items
CREATE OR REPLACE FUNCTION public.decrement_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE name = NEW.product_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_decrement_stock ON public.order_items;

CREATE TRIGGER trigger_decrement_stock
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.decrement_stock();