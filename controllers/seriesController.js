const db = require("../db/queries");

async function getSeries(req, res) {
	const series = await db.getAllSeries();
	console.log("Series", series);
	res.render("../views/series.ejs", { series: series });
}

async function insertSeriesGet(req, res) {
	const categories = await db.getAllCategories();
	const publishers = await db.getAllPublishers();
	res.render("../views/series_add.ejs", {
		title: "Add New Series",
		categories,
		publishers,
		errors: [],
		values: {},
	});
}

async function insertSeriesPost(req, res) {
	const { add } = req.body;
	await db.insertSeries(add);
	res.redirect("/series");
}

async function deleteSeriesGet(req, res) {
	await db.deleteSeries();
	res.redirect("/series");
}

module.exports = {
	getSeries,
	insertSeriesGet,
	insertSeriesPost,
	deleteSeriesGet,
};
