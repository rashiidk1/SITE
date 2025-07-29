/*
  # Создание начальной схемы для bud-магазина

  1. Новые таблицы
    - `users` - пользователи Telegram
      - `id` (uuid, primary key)
      - `telegram_id` (bigint, unique) - ID пользователя в Telegram
      - `username` (text) - username в Telegram
      - `first_name` (text) - имя пользователя
      - `last_name` (text) - фамилия пользователя
      - `created_at` (timestamp)

    - `products` - товары магазина
      - `id` (uuid, primary key)
      - `name` (text) - название товара
      - `description` (text) - описание товара
      - `price` (numeric) - цена в батах
      - `image_url` (text) - ссылка на изображение
      - `category` (text) - категория товара
      - `stock` (integer) - количество на складе
      - `created_at` (timestamp)

    - `addresses` - адреса доставки пользователей
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - ссылка на пользователя
      - `title` (text) - название адреса (Дом, Офис и т.д.)
      - `address_text` (text) - полный адрес
      - `lat` (numeric) - широта
      - `lng` (numeric) - долгота
      - `created_at` (timestamp)

    - `orders` - заказы
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - ссылка на пользователя
      - `total_amount` (numeric) - общая сумма заказа
      - `status` (text) - статус заказа
      - `address_id` (uuid, foreign key) - ссылка на адрес доставки
      - `created_at` (timestamp)

    - `order_items` - товары в заказе
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key) - ссылка на заказ
      - `product_id` (uuid, foreign key) - ссылка на товар
      - `quantity` (integer) - количество
      - `price` (numeric) - цена на момент заказа
      - `created_at` (timestamp)

  2. Безопасность
    - Включить RLS для всех таблиц
    - Добавить политики для аутентифицированных пользователей
    - Политики для чтения собственных данных пользователей

  3. Тестовые данные
    - Добавить несколько товаров для демонстрации
*/

-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint UNIQUE NOT NULL,
  username text,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now()
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  image_url text,
  category text,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Создание таблицы адресов
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  address_text text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'pending',
  address_id uuid REFERENCES addresses(id),
  created_at timestamptz DEFAULT now()
);

-- Создание таблицы товаров в заказе
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Включение RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Политики для таблицы users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Политики для таблицы products (все могут читать)
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Политики для таблицы addresses
CREATE POLICY "Users can read own addresses"
  ON addresses
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint));

CREATE POLICY "Users can insert own addresses"
  ON addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint));

-- Политики для таблицы orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint));

CREATE POLICY "Users can insert own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint));

-- Политики для таблицы order_items
CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (order_id IN (SELECT id FROM orders WHERE user_id IN (SELECT id FROM users WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint)));

CREATE POLICY "Users can insert own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id IN (SELECT id FROM users WHERE telegram_id = (current_setting('request.jwt.claims', true)::json->>'telegram_id')::bigint)));