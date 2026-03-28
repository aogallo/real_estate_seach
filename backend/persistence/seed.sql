INSERT INTO real_estates
(title, description, type, price, rooms, restroom, area_m2, location, image_url, published_date)
VALUES

-- 🏠 Casas en zona 10 (3 habitaciones)
(
    'Casa familiar en zona 10',
    'Ideal para familia, cerca de comercios',
    'casa',
    220000.00,
    3,
    2,
    160.00,
    'Zona 10',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    CURDATE() - INTERVAL 10 DAY
),
(
    'Casa moderna en zona 10',
    'Diseño contemporáneo con jardín',
    'casa',
    280000.00,
    3,
    3,
    190.00,
    'Zona 10',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    CURDATE() - INTERVAL 5 DAY
),

-- 🏢 Departamentos < 150k
(
    'Apartamento económico',
    'Perfecto para inversión',
    'departamento',
    120000.00,
    2,
    1,
    80.00,
    'Zona 12',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    CURDATE() - INTERVAL 20 DAY
),
(
    'Departamento compacto',
    'Ubicación céntrica',
    'departamento',
    140000.00,
    1,
    1,
    60.00,
    'Zona 9',
    'https://images.unsplash.com/photo-1494526585095-c41746248156',
    CURDATE() - INTERVAL 15 DAY
),

-- 🚿 +2 baños y >=150m2
(
    'Casa amplia con jardín',
    'Gran espacio para familia grande',
    'casa',
    350000.00,
    4,
    3,
    200.00,
    'Zona 16',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    CURDATE() - INTERVAL 25 DAY
),
(
    'Residencia de lujo',
    'Amplios espacios y acabados premium',
    'casa',
    500000.00,
    5,
    4,
    400.00,
    'Zona 14',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    CURDATE() - INTERVAL 3 DAY
),

-- 🗓️ Casas últimos 30 días
(
    'Casa reciente en zona 15',
    'Nueva en el mercado',
    'casa',
    300000.00,
    3,
    2,
    170.00,
    'Zona 15',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
    CURDATE() - INTERVAL 7 DAY
),

-- 🌄 Terrenos entre 50k y 100k
(
    'Terreno económico',
    'Ideal para construir vivienda',
    'terreno',
    60000.00,
    0,
    0,
    300.00,
    'Villa Nueva',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    CURDATE() - INTERVAL 12 DAY
),
(
    'Terreno en venta accesible',
    'Zona tranquila',
    'terreno',
    90000.00,
    0,
    0,
    450.00,
    'Mixco',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
    CURDATE() - INTERVAL 18 DAY
),

-- 🏢 Departamentos 2 habitaciones zona 15
(
    'Apartamento en zona 15',
    'Excelente ubicación',
    'departamento',
    200000.00,
    2,
    2,
    110.00,
    'Zona 15',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858',
    CURDATE() - INTERVAL 8 DAY
),
(
    'Departamento moderno zona 15',
    'Cerca de áreas comerciales',
    'departamento',
    230000.00,
    2,
    2,
    120.00,
    'Zona 15',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    CURDATE() - INTERVAL 2 DAY
);
