const db = require("../db/queries");

async function getCategory(req, res) {
	const categorys = await db.getAllCategories();
	res.render("../views/category.ejs", { categorys: categorys });
}

async function getSeriesByCategoryId(req, res) {
	const id = req.params.id;
	const category = await db.getCategoryById(id);
	if (!category) {
		return res.status(404).render("../views/404.ejs");
	}
	const series = await db.getSeriesByCategoryId(id);
	res.render("../views/category_details.ejs", { category, series });
}

module.exports = {
	getCategory,
	getSeriesByCategoryId,
};
