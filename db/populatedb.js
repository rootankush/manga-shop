#! /usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");
const connectionString = process.env.DB_URL;

const SQL = `
CREATE TABLE IF NOT EXISTS publishers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS series (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR (255) NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(8, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    cover_url VARCHAR (500),
    publisher_id INTEGER NOT NULL REFERENCES publishers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS series_genres (
    series_id INTEGER NOT NULL REFERENCES series(id) ON DELETE CASCADE,
   genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE RESTRICT,
    PRIMARY KEY (series_id, genre_id)
);

INSERT INTO publishers (name, description) VALUES
  ('Shueisha', 'Publisher of Weekly Shonen Jump and many long-running action series.'),
  ('Kodansha', 'One of the largest manga publishers in Japan, behind Weekly Shonen Magazine.'),
  ('Shogakukan', 'Publisher of Weekly Shonen Sunday and a wide range of mystery and drama titles.'),
  ('Square Enix', 'Game and manga publisher behind Monthly Shonen Gangan.'),
  ('Hakusensha', 'Publisher of Young Animal and Hana to Yume, covering dark fantasy and romance.')
ON CONFLICT (name) DO NOTHING;
 
INSERT INTO genres (name, description) VALUES
  ('Shonen', 'Action-driven stories aimed at a young male audience.'),
  ('Seinen', 'More mature stories with complex themes, aimed at adult men.'),
  ('Shojo', 'Stories focused on relationships and emotion, aimed at a young female audience.'),
  ('Action', 'Fights, chases, and high-stakes conflict.'),
  ('Adventure', 'Journeys, exploration, and discovery.'),
  ('Fantasy', 'Magic, other worlds, and supernatural powers.'),
  ('Romance', 'Love stories at the centre of the plot.'),
  ('Comedy', 'Humour-first stories and running gags.'),
  ('Mystery', 'Puzzles, investigations, and hidden truths.'),
  ('Historical', 'Stories set in real historical periods.')
ON CONFLICT (name) DO NOTHING;
 
INSERT INTO series (title, description, price, stock, publisher_id)
SELECT v.title, v.description, v.price, v.stock, p.id
FROM (VALUES
  ('One Piece', 'A young pirate sets out to find the legendary treasure and become king of the seas.', 9.99, 25, 'Shueisha'),
  ('Naruto', 'An outcast ninja dreams of becoming the leader of his village.', 9.99, 18, 'Shueisha'),
  ('Jujutsu Kaisen', 'A student joins a secret school of sorcerers to fight cursed spirits.', 9.99, 4, 'Shueisha'),
  ('Spy x Family', 'A spy, an assassin, and a telepath pose as a normal family for a secret mission.', 9.99, 14, 'Shueisha'),
  ('Kaguya-sama: Love Is War', 'Two brilliant student council leaders refuse to be the first to confess.', 10.99, 7, 'Shueisha'),
  ('Attack on Titan', 'Humanity lives behind giant walls to survive man-eating giants.', 10.99, 0, 'Kodansha'),
  ('Vinland Saga', 'A young warrior seeks revenge in the age of the Vikings.', 14.99, 3, 'Kodansha'),
  ('Fullmetal Alchemist', 'Two brothers search for a way to restore their bodies after a failed alchemy ritual.', 9.99, 11, 'Square Enix'),
  ('Detective Conan', 'A teen detective shrunk into a child keeps solving cases in disguise.', 9.99, 20, 'Shogakukan'),
  ('Monster', 'A surgeon hunts the patient he saved, who has grown into a killer.', 14.99, 6, 'Shogakukan'),
  ('Berserk', 'A lone mercenary fights against fate in a dark medieval world.', 14.99, 2, 'Hakusensha'),
  ('Fruits Basket', 'A kind orphan discovers a family cursed to turn into zodiac animals.', 9.99, 9, 'Hakusensha')
) AS v(title, description, price, stock, publisher_name)
JOIN publishers p ON p.name = v.publisher_name
ON CONFLICT (title) DO NOTHING;
 
INSERT INTO series_genres (series_id, genre_id)
SELECT s.id, g.id
FROM (VALUES
  ('One Piece', 'Shonen'), ('One Piece', 'Adventure'), ('One Piece', 'Action'),
  ('Naruto', 'Shonen'), ('Naruto', 'Action'), ('Naruto', 'Adventure'),
  ('Jujutsu Kaisen', 'Shonen'), ('Jujutsu Kaisen', 'Action'), ('Jujutsu Kaisen', 'Fantasy'),
  ('Spy x Family', 'Shonen'), ('Spy x Family', 'Comedy'), ('Spy x Family', 'Action'),
  ('Kaguya-sama: Love Is War', 'Seinen'), ('Kaguya-sama: Love Is War', 'Romance'), ('Kaguya-sama: Love Is War', 'Comedy'),
  ('Attack on Titan', 'Shonen'), ('Attack on Titan', 'Action'), ('Attack on Titan', 'Fantasy'),
  ('Vinland Saga', 'Seinen'), ('Vinland Saga', 'Historical'), ('Vinland Saga', 'Action'), ('Vinland Saga', 'Adventure'),
  ('Fullmetal Alchemist', 'Shonen'), ('Fullmetal Alchemist', 'Fantasy'), ('Fullmetal Alchemist', 'Adventure'), ('Fullmetal Alchemist', 'Action'),
  ('Detective Conan', 'Shonen'), ('Detective Conan', 'Mystery'),
  ('Monster', 'Seinen'), ('Monster', 'Mystery'),
  ('Berserk', 'Seinen'), ('Berserk', 'Fantasy'), ('Berserk', 'Action'),
  ('Fruits Basket', 'Shojo'), ('Fruits Basket', 'Romance'), ('Fruits Basket', 'Fantasy')
) AS v(series_title, genre_name)
JOIN series s ON s.title = v.series_title
JOIN genres g ON g.name = v.genre_name
ON CONFLICT DO NOTHING;

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
