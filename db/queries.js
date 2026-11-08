const pool = require("./pool.js");

async function getAllSeries() {
	const { rows } = await pool.query(
		"SELECT series.id, series.title, series.description, categories.category_name, publishers.publisher_name FROM series JOIN categories ON categories.id = series.category_id JOIN publishers ON publishers.id = series.publisher_id",
	);
	return rows;
}

async function getSerieById(id) {
	const { rows } = await pool.query(
		"SELECT series.id, series.title, series.description, series.category_id, series.publisher_id, categories.category_name, publishers.publisher_name FROM series JOIN categories ON categories.id = series.category_id JOIN publishers ON publishers.id = series.publisher_id WHERE series.id = ($1)",
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
async function editSeries(id, title, description, categoryId, publisherId) {
	const { rowCount } = await pool.query(
		"UPDATE series SET title = $1, description = $2, category_id = $3, publisher_id = $4 WHERE id = $5",
		[title, description, categoryId, publisherId, id],
	);
	return rowCount;
}

async function deleteSeries(id) {
	const { rowCount } = await pool.query("DELETE FROM series WHERE id = $1", [
		id,
	]);
	return rowCount;
}

async function insertCategory(category_name, description) {
	await pool.query(
		"INSERT INTO categories (category_name, description) VALUES ($1, $2)",
		[category_name, description],
	);
}

async function insertPublisher(publisher_name, description) {
	await pool.query(
		"INSERT INTO publishers (publisher_name, description) VALUES ($1, $2)",
		[publisher_name, description],
	);
}

async function getAllPublishers() {
	const { rows } = await pool.query(
		"SELECT publishers.id, publishers.publisher_name, publishers.description FROM publishers",
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
		"SELECT categories.id, categories.category_name, categories.description FROM categories",
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
	insertCategory,
	insertPublisher,
	editSeries,
	deleteSeries,
	getCategoryById,
	getPublisherById,
	getAllPublishers,
	getAllCategories,
	getSeriesByCategoryId,
	getSeriesByPublisherId,
};
