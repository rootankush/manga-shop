const db = require("../db/queries");

async function getPublisher(req, res) {
	const publishers = await db.getAllPublishers;
	console.log("Publisher", publishers);
	res.render("../views/publisher.ejs", { publishers: publishers });
}

module.exports = {
	getPublisher,
};
