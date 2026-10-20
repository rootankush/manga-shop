#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");
const connectionString = process.env.DB_URL;

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);
 
CREATE TABLE IF NOT EXISTS publishers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  publisher_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);
 
CREATE TABLE IF NOT EXISTS series (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(8, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  cover_url VARCHAR(500),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  publisher_id INTEGER NOT NULL REFERENCES publishers(id) ON DELETE RESTRICT
);
 
INSERT INTO categories (category_name, description) VALUES
  ('Shonen', 'Action and adventure stories aimed at a young male audience.'),
  ('Seinen', 'More mature stories with complex themes, aimed at adult men.'),
  ('Shojo', 'Stories focused on relationships and emotion, aimed at a young female audience.'),
  ('Josei', 'Realistic stories about adult life and relationships, aimed at adult women.')
ON CONFLICT (name) DO NOTHING;
 
INSERT INTO publishers (publisher_name, description) VALUES
  ('Shueisha', 'Publisher of Weekly Shonen Jump and many long-running action series.'),
  ('Kodansha', 'One of the largest manga publishers in Japan, behind Weekly Shonen Magazine.'),
  ('Shogakukan', 'Publisher of Weekly Shonen Sunday and a wide range of mystery and drama titles.'),
  ('Square Enix', 'Game and manga publisher behind Monthly Shonen Gangan.'),
  ('Hakusensha', 'Publisher of Young Animal and Hana to Yume, covering dark fantasy and romance.')
ON CONFLICT (name) DO NOTHING;
 
INSERT INTO series (title, description, price, stock, category_id, publisher_id)
SELECT v.title, v.description, v.price, v.stock, c.id, p.id
FROM (VALUES
  ('One Piece', 'A young pirate sets out to find the legendary treasure and become king of the seas.', 9.99, 25, 'Shonen', 'Shueisha'),
  ('Naruto', 'An outcast ninja dreams of becoming the leader of his village.', 9.99, 18, 'Shonen', 'Shueisha'),
  ('Jujutsu Kaisen', 'A student joins a secret school of sorcerers to fight cursed spirits.', 9.99, 4, 'Shonen', 'Shueisha'),
  ('Spy x Family', 'A spy, an assassin, and a telepath pose as a normal family for a secret mission.', 9.99, 14, 'Shonen', 'Shueisha'),
  ('Kaguya-sama: Love Is War', 'Two brilliant student council leaders refuse to be the first to confess.', 10.99, 7, 'Seinen', 'Shueisha'),
  ('Attack on Titan', 'Humanity lives behind giant walls to survive man-eating giants.', 10.99, 0, 'Shonen', 'Kodansha'),
  ('Vinland Saga', 'A young warrior seeks revenge in the age of the Vikings.', 14.99, 3, 'Seinen', 'Kodansha'),
  ('Fullmetal Alchemist', 'Two brothers search for a way to restore their bodies after a failed alchemy ritual.', 9.99, 11, 'Shonen', 'Square Enix'),
  ('Detective Conan', 'A teen detective shrunk into a child keeps solving cases in disguise.', 9.99, 20, 'Shonen', 'Shogakukan'),
  ('Monster', 'A surgeon hunts the patient he saved, who has grown into a killer.', 14.99, 6, 'Seinen', 'Shogakukan'),
  ('Berserk', 'A lone mercenary fights against fate in a dark medieval world.', 14.99, 2, 'Seinen', 'Hakusensha'),
  ('Fruits Basket', 'A kind orphan discovers a family cursed to turn into zodiac animals.', 9.99, 9, 'Shojo', 'Hakusensha')
) AS v(title, description, price, stock, category_name, publisher_name)
JOIN categories c ON c.category_name = v.category_name
JOIN publishers p ON p.publisher_name = v.publisher_name
ON CONFLICT (title) DO NOTHING;
`;

async function main() {
	console.log("seeding");
	const client = new Client({
		connectionString: connectionString,
	});
	await client.connect();
	await client.query(SQL);
	await client.end();
	console.log("done");
}

main();
