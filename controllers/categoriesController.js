const db = require("../db/queries");
const { body, validationResult, matechedData } = require("express-validator");

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 255 })
    .withMessage("Name must be 255 characters or fewer"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description must be 500 characters or fewer"),
];

async function getCategory(req, res) {
  const categorys = await db.getAllCategories();
  res.render("../views/category/category.ejs", { categorys: categorys });
}

async function getSeriesByCategoryId(req, res) {
  const id = req.params.id;
  const category = await db.getCategoryById(id);
  if (!category) {
    return res.status(404).render("../views/404.ejs");
  }
  const series = await db.getSeriesByCategoryId(id);
  res.render("../views/category/category_details.ejs", { category, series });
}

async function insertCategoryGet(req, res) {
  res.render("../views/category/category_add.ejs", {
    title: "Add New Category",
    errors: [],
    values: {},
  });
}

const insertCategoryPost = [
  validateCategory,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("../views/category/category_add.ejs", {
        title: "New Category",
        errors: errors.array(),
        values: req.body,
      });
    }

    const { name, description } = matechedData(req);
    await db.insertCategory(name, description);
    res.redirect("/categories");
  },
];

module.exports = {
  getCategory,
  insertCategoryGet,
  insertCategoryPost,
  getSeriesByCategoryId,
};
