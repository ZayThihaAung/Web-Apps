-- Run this once in the Supabase SQL Editor before using the app.

-- Remaining budget (single row)
CREATE TABLE IF NOT EXISTS public."Budget" (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  amount integer NOT NULL DEFAULT 0
);

INSERT INTO public."Budget" (id, amount)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Each expense has its own category row, so category names must not be globally unique
ALTER TABLE public."Category" DROP CONSTRAINT IF EXISTS "Category_category_key";
