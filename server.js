require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const categoriesController = require("../manga-shop/controllers/categoriesController");
const publishersController = require("../manga-shop/controllers/publishersController");
const seriesController = require("../manga-shop/controllers/seriesController");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
	res.render("./index.ejs");
});

//GET
app.get("/series", seriesController.getSeries);
app.get("/publishers", publishersController.getPublisher);
app.get("/categories", categoriesController.getCategory);

// create a series
app.get("/series/add", seriesController.insertSeriesGet);
app.post("/series", seriesController.insertSeriesPost);

// selecte by id
app.get("/series/:id", seriesController.getSerieById);
app.get("/categories/:id", categoriesController.getSeriesByCategoryId);
app.get("/publishers/:id", publishersController.getSeriesByPublisherId);

// create a publisher
app.get("/categories/add", categoriesController.insertCategoryGet);
app.post("/categories/add", categoriesController.insertCategoryPost);

// create a category

// edit series
app.get("/series/:id/edit", seriesController.editSeriesGet);
app.post("/series/:id/edit", seriesController.editSeriesPost);

// delete a series
app.get("/series/:id/delete", seriesController.deleteSeriesGet);
app.post("/series/:id/delete", seriesController.deleteSeriesPost);

// delete a publisher

// delete a category

app.listen(port, () => {
	console.log(`server listening to ${port}`);
});
