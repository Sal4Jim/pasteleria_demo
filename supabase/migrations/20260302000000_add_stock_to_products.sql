-- 1. Añadir la columna de stock a la tabla de productos (por defecto 0)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0;

-- 2. Crear la función que descontará el stock
CREATE OR REPLACE FUNCTION public.decrement_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Se asume que order_items tiene product_name
  -- Actualizamos la tabla de products restando la cantidad. 
  -- ATENCIÓN: Al no tener product_id en order_items sino product_name, necesitamos hacer un update con el nombre
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE name = NEW.product_name;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear el Trigger para disparar la función después de un INSERT en order_items
DROP TRIGGER IF EXISTS trigger_decrement_stock ON public.order_items;

CREATE TRIGGER trigger_decrement_stock
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.decrement_stock();
