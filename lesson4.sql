insert into products (title, description, price) values
('Product 1', 'bla bla 1', 100),
('Product 2', 'qwe qwe 2', 200),
('Product 3', 'zxc zxc 2', 100),

insert into stocks (product_id, products_count) values
('cbb8aec0-327e-4559-b719-776ccaf448ae', 2),
('dc3b2c79-07b2-4f9f-b50c-38309e519385', 1)


--create table products (
--	id uuid primary key default uuid_generate_v4(),
--	title text NOT NULL,
--	description text,
--	price integer
--)¬

--create table stocks (
--	product_id uuid,
--	foreign key("product_id") references "products" ("id"),
--	products_count integer
--)

--drop table stocks


--create extension if not exists "uuid-ossp";
