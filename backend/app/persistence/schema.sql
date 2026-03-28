CREATE TABLE real_estates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    rooms INT NOT NULL,
    restroom INT NOT NULL,
    area_m2 DECIMAL(10,2),
    location VARCHAR(255),
    published_date DATE
);
