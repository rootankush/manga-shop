const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const validateSerie = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title is required")
		.isLength({ max: 255 })
		.withMessage("Title must be 255 character or fewer."),
	body("description")
		.trim()
		.notEmpty()
		.withMessage("Description is required")
		.isLength({ max: 1000 })
		.withMessage("Description must be 500 characters or fewer."),
	body("categoryId")
		.isInt({ min: 1, max: 2147483647 })
		.withMessage("Choose a category")
		.bail()
		.toInt()
		.custom(async (id) => {
			const category = await db.getCategoryById(id);
			if (!category) throw new Error("That category doesnt exist");
		}),
	body("publisherId")
		.isInt({ min: 1, max: 2147483647 })
		.withMessage("Choose a publisher")
		.bail()
		.toInt()
		.custom(async (id) => {
			const publisher = await db.getPublisherById(id);
			if (!publisher) throw new Error("That publisher doesnt exist");
		}),
];

async function getSeries(req, res) {
	const series = await db.getAllSeries();
	console.log("Series", series);
	res.render("../views/series/series.ejs", { series: series });
}

async function getSerieById(req, res) {
	const id = req.params.id;
	const serie = await db.getSerieById(id);
	if (!serie) {
		return res.status(404).render("../views/404.ejs");
	}
	res.render("../views/series/series_details.ejs", { serie: serie });
}

async function insertSeriesGet(req, res) {
	const categories = await db.getAllCategories();
	const publishers = await db.getAllPublishers();
	res.render("../views/series/series_add.ejs", {
		title: "Add New Series",
		categories,
		publishers,
		errors: [],
		values: {},
	});
}

const insertSeriesPost = [
	validateSerie,
	async (req, res) => {
		const categories = await db.getAllCategories();
		const publishers = await db.getAllPublishers();
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render("../views/series/series_add.ejs", {
				title: "New Series",
				categories,
				publishers: publishers,
				errors: errors.array(),
				values: req.body,
			});
		}

		const { title, description, categoryId, publisherId } = matchedData(req);
		await db.insertSeries(title, description, categoryId, publisherId);
		res.redirect("/series");
	},
];

async function editSeriesGet(req, res) {
	const categories = await db.getAllCategories();
	const publishers = await db.getAllPublishers();
	const serie = await db.getSerieById(req.params.id);
	res.render("../views/series/series_edit.ejs", {
		title: "Edit Series",
		categories,
		publishers,
		errors: [],
		values: {
			title: serie.title,
			description: serie.description,
			categoryId: serie.category_id,
			publisherId: serie.publisher_id,
		},
	});
}

const editSeriesPost = [
	validateSerie,
	async (req, res) => {
		const id = req.params.id;
		const categories = await db.getAllCategories();
		const publishers = await db.getAllPublishers();
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render("../views/series/series_add.ejs", {
				title: "Edit Series",
				categories,
				publishers,
				errors: errors.array(),
				values: req.body,
			});
		}

		const { title, description, categoryId, publisherId } = matchedData(req);
		await db.editSeries(id, title, description, categoryId, publisherId);
		res.redirect("/series");
	},
];

async function deleteSeriesGet(req, res) {
	await db.deleteSeries(req.params.id);
	res.redirect(`/series`);
}

async function deleteSeriesPost(req, res) {
	const id = req.params.id;
	if (!/^\d+$/.test(id)) {
		return res.status(404).render("../views/404.ejs");
	}
	const deleted = await db.deleteSeries(id);
	if (!deleted) {
		return res.status(404).render("../views/404.ejs");
	}
	res.redirect("/series");
}

module.exports = {
	getSeries,
	getSerieById,
	insertSeriesGet,
	insertSeriesPost,
	editSeriesGet,
	editSeriesPost,
	deleteSeriesGet,
	deleteSeriesPost,
};
