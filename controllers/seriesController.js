const db = require("../db/queries");

async function getSeries(req, res) {
	const series = await db.getAllSeries();
	console.log("Series", series);
	res.render("../views/series.ejs", { series: series });
}

async function getSerieById(req, res) {
	const id = req.params.id;
	const serie = await db.getSerieById(id);
	if (!serie) {
		return res.status(404).render("../views/404.ejs");
	}
	res.render("../views/series_details.ejs", { serie: serie });
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
	getSerieById,
	insertSeriesGet,
	insertSeriesPost,
	deleteSeriesGet,
};
