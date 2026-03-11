-- database/seed.sql

-- Insert Categories
INSERT INTO categories (name) VALUES 
('Electronics'), 
('Fashion'), 
('Appliances'), 
('Home & Furniture'), 
('Books')
ON CONFLICT (name) DO NOTHING;

-- Insert 25 Products
INSERT INTO products (category_id, name, description, price, stock) VALUES
(1, 'Smartphone X', 'Latest smartphone with high-end features', 699.99, 50),
(1, 'Laptop Pro', 'Powerful laptop for professionals', 1299.99, 30),
(1, 'Wireless Earbuds', 'Noise-cancelling wireless earbuds', 149.99, 100),
(1, 'Smartwatch', 'Fitness and health tracking smartwatch', 199.99, 80),
(1, 'Gaming Console', 'Next-gen gaming console', 499.99, 40),
(1, '4K TV', '55-inch 4K Ultra HD Smart TV', 599.99, 20),
(2, 'Men''s T-Shirt', 'Cotton casual t-shirt for men', 19.99, 200),
(2, 'Women''s Jeans', 'Denim jeans for women', 39.99, 150),
(2, 'Sneakers', 'Comfortable running sneakers', 59.99, 100),
(2, 'Winter Jacket', 'Warm winter jacket', 89.99, 50),
(2, 'Formal Shirt', 'Men''s formal shirt', 29.99, 120),
(2, 'Summer Dress', 'Women''s summer floral dress', 34.99, 90),
(3, 'Refrigerator', 'Double door refrigerator', 899.99, 15),
(3, 'Washing Machine', 'Front-load washing machine', 499.99, 25),
(3, 'Microwave Oven', 'Convection microwave oven', 129.99, 40),
(3, 'Air Conditioner', '1.5 Ton split AC', 399.99, 20),
(3, 'Vacuum Cleaner', 'Bagless vacuum cleaner', 89.99, 60),
(4, 'Sofa Set', '3-seater living room sofa', 299.99, 10),
(4, 'Dining Table', '6-seater wooden dining table', 399.99, 12),
(4, 'Office Chair', 'Ergonomic office chair', 149.99, 45),
(4, 'Bed Frame', 'Queen size wooden bed frame', 249.99, 15),
(5, 'The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 9.99, 200),
(5, '1984', 'Dystopian novel by George Orwell', 12.99, 180),
(5, 'Sapiens', 'A Brief History of Humankind', 15.99, 150),
(5, 'Atomic Habits', 'Self-help book by James Clear', 18.99, 250);

-- Insert Images (Assuming standard URLs for demo)
INSERT INTO product_images (product_id, image_url)
SELECT id, 'https://via.placeholder.com/300?text=' || REPLACE(name, ' ', '+')
FROM products;
