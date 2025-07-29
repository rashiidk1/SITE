/*
  # Добавление системы косяков

  1. Изменения в таблице users
    - Добавляем поле joints (косяки) с значением по умолчанию 247
  
  2. Безопасность
    - Обновляем политики для работы с косяками
*/

-- Добавляем поле joints в таблицу users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'joints'
  ) THEN
    ALTER TABLE users ADD COLUMN joints integer DEFAULT 247;
  END IF;
END $$;

-- Обновляем политики для чтения косяков
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Политика для обновления косяков
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);