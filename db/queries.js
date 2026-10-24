const pool = require("./pool.js");

async function getAllSeries() {
	const { rows } = await pool.query(
		"SELECT series.id, series.title, series.description, categories.category_name, publishers.publisher_name FROM series JOIN categories ON categories.id = series.category_id JOIN publishers ON publishers.id = series.publisher_id",
	);
	return rows;
}

async function getSerieById(id) {
	const { rows } = await pool.query(
		"SELECT series.id, series.title, series.description, categories.category_name, publishers.publisher_name FROM series JOIN categories ON categories.id = series.category_id JOIN publishers ON publishers.id = series.publisher_id WHERE series.id = ($1)",
		[id],
	);
	return rows[0];
}

async function insertSeries(title, description, categoryId, publisherId) {
	await pool.query(
		"INSERT INTO series (title, description, category_id, publisher_id) VALUES ($1, $2, $3, $4)",
		[title, description, categoryId, publisherId],
	);
}

async function deleteSeries(title) {
	await pool.query("DELETE * FROM series WHERE title LIKE ($1)", [title]);
}

async function getAllPublishers() {
	const { rows } = await pool.query(
		"SELECT publishers.publisher_name, publishers.description FROM publishers",
	);
	return rows;
}

async function getPublisherById(id) {
	const { rows } = await pool.query(
		"SELECT publishers.publisher_name, publishers.description FROM publishers WHERE id = $1",
		[id],
	);
	return rows[0];
}

async function getCategoryById(id) {
	const { rows } = await pool.query(
		"SELECT categories.category_name, categories.description FROM categories WHERE id = $1",
		[id],
	);
	return rows[0];
}

async function getAllCategories() {
	const { rows } = await pool.query(
		"SELECT categories.category_name, categories.description FROM categories",
	);
	return rows;
}

async function getSeriesByCategoryId(categoryId) {
	const { rows } = await pool.query(
		"SELECT * FROM series WHERE category_id = $1",
		[categoryId],
	);
	return rows;
}

async function getSeriesByPublisherId(publisherId) {
	const { rows } = await pool.query(
		"SELECT * FROM series WHERE publisher_id = $1",
		[publisherId],
	);
	return rows;
}

module.exports = {
	getAllSeries,
	getSerieById,
	insertSeries,
	deleteSeries,
	getCategoryById,
	getPublisherById,
	getAllPublishers,
	getAllCategories,
	getSeriesByCategoryId,
	getSeriesByPublisherId,
};
