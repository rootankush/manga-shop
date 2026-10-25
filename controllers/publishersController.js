const db = require("../db/queries");

async function getPublisher(req, res) {
	const publishers = await db.getAllPublishers();
	res.render("../views/publisher.ejs", { publishers: publishers });
}

async function getSeriesByPublisherId(req, res) {
	const id = req.params.id;
	const publisher = await db.getPublisherById(id);
	if (!publisher) {
		return res.status(404).render("../views/404.ejs");
	}
	const series = await db.getSeriesByPublisherId(id);
	res.render("../views/publisher_details.ejs", { publisher, series });
}

module.exports = {
	getPublisher,
	getSeriesByPublisherId,
};
