const db = require("../db/queries");

async function getCategory(req, res) {
	const categorys = await db.getAllCategories();
	console.log("Category", categorys);
	res.render("../views/category.ejs", { categorys: categorys });
}

module.exports = {
	getCategory,
};
