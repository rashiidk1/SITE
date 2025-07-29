/*
  # Добавление тестовых товаров для bud-магазина

  1. Тестовые товары
    - Различные категории растений и аксессуаров
    - Реалистичные цены в батах
    - Красивые изображения с Pexels
    - Описания товаров на английском языке

  2. Категории
    - Indoor Plants - комнатные растения
    - Outdoor Plants - уличные растения  
    - Seeds - семена
    - Accessories - аксессуары
    - Popular - популярные товары
*/

-- Добавление тестовых товаров
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
  (
    'Monstera Deliciosa',
    'Beautiful indoor plant with large, glossy leaves. Perfect for beginners and adds tropical vibes to any room.',
    850,
    'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Indoor Plants',
    25
  ),
  (
    'Snake Plant',
    'Low-maintenance succulent that purifies air and thrives in low light conditions. Great for bedrooms.',
    420,
    'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Indoor Plants',
    30
  ),
  (
    'Fiddle Leaf Fig',
    'Statement plant with large, violin-shaped leaves. Requires bright, indirect light and regular watering.',
    1200,
    'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Indoor Plants',
    15
  ),
  (
    'Pothos Golden',
    'Easy-care trailing plant perfect for hanging baskets or shelves. Grows quickly in various light conditions.',
    320,
    'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Indoor Plants',
    40
  ),
  (
    'Rubber Tree',
    'Glossy, dark green leaves make this plant a stunning focal point. Tolerates lower light conditions.',
    680,
    'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Indoor Plants',
    20
  ),
  (
    'Peace Lily',
    'Elegant plant with white flowers and dark green leaves. Excellent air purifier for indoor spaces.',
    450,
    'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Indoor Plants',
    35
  ),
  (
    'Bamboo Palm',
    'Tropical palm that adds exotic flair to any space. Prefers bright, indirect light and high humidity.',
    950,
    'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Outdoor Plants',
    12
  ),
  (
    'Bird of Paradise',
    'Dramatic plant with large paddle-shaped leaves. Creates a tropical paradise in your garden.',
    1500,
    'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Outdoor Plants',
    8
  ),
  (
    'Aloe Vera',
    'Medicinal succulent with healing properties. Very low maintenance and perfect for sunny windowsills.',
    280,
    'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Popular',
    50
  ),
  (
    'Cactus Mix',
    'Collection of small decorative cacti. Perfect for desk decoration and requires minimal care.',
    180,
    'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Popular',
    60
  ),
  (
    'Herb Garden Kit',
    'Complete kit with basil, mint, and cilantro seeds. Everything you need to start your herb garden.',
    350,
    'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Seeds',
    25
  ),
  (
    'Sunflower Seeds',
    'Premium sunflower seeds for growing beautiful, tall sunflowers in your garden.',
    120,
    'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Seeds',
    100
  ),
  (
    'Plant Food Premium',
    'Organic fertilizer that promotes healthy growth and vibrant colors in all types of plants.',
    220,
    'https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Accessories',
    45
  ),
  (
    'Ceramic Pot Set',
    'Set of 3 beautiful ceramic pots in different sizes. Perfect for repotting your growing plants.',
    480,
    'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Accessories',
    20
  ),
  (
    'Watering Can Copper',
    'Elegant copper watering can that combines functionality with style. Perfect for indoor plant care.',
    650,
    'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Accessories',
    15
  );