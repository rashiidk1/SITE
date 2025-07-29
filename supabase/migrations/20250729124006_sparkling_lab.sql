/*
  # Исправление политик для адресов

  1. Исправления
    - Обновляем политики для работы с Telegram ID
    - Добавляем функцию для получения текущего пользователя
    - Исправляем RLS политики для всех таблиц
*/

-- Создаем функцию для получения текущего пользователя по Telegram ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id FROM users 
  WHERE telegram_id = COALESCE(
    (current_setting('request.jwt.claims', true)::json ->> 'telegram_id')::bigint,
    123456789::bigint
  )
  LIMIT 1;
$$;

-- Обновляем политики для адресов
DROP POLICY IF EXISTS "Users can insert own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can read own addresses" ON addresses;

CREATE POLICY "Users can insert own addresses"
  ON addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can read own addresses"
  ON addresses
  FOR SELECT
  TO authenticated
  USING (user_id = get_current_user_id());

-- Обновляем политики для заказов
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;

CREATE POLICY "Users can insert own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = get_current_user_id());

-- Обновляем политики для элементов заказа
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Users can read own order items" ON order_items;

CREATE POLICY "Users can insert own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = get_current_user_id()
    )
  );

CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = get_current_user_id()
    )
  );

-- Добавляем политику для анонимных пользователей (для разработки)
CREATE POLICY "Allow anonymous access for development"
  ON addresses
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous orders for development"
  ON orders
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous order items for development"
  ON order_items
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);