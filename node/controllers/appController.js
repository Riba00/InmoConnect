import { Sequelize } from "sequelize";
import { Price, Category, Property } from "../models/index.js";

const init = async (req, res) => {
  const [categories, prices, houses, flats] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: {
        categoryId: 1,
      },
      include: [
        {
          model: Price,
          as: "price",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
    Property.findAll({
      limit: 3,
      where: {
        categoryId: 2,
      },
      include: [
        {
          model: Price,
          as: "price",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  houses.forEach((house) => {
    if (typeof house.images === "string") {
      house.images = JSON.parse(house.images);
    }
  });

  flats.forEach((flat) => {
    if (typeof flat.images === "string") {
      flat.images = JSON.parse(flat.images);
    }
  });

  res.render("init", {
    page: "Init",
    categories,
    prices,
    houses,
    flats,
    csrfToken: req.csrfToken(),
  });
};

const category = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByPk(id);

  if (!category) {
    return res.redirect("/404");
  }

  const properties = await Property.findAll({
    where: {
      categoryId: id,
    },
    include: [{ model: Price, as: "price" }],
  });

  properties.forEach((property) => {
    if (typeof property.images === "string") {
      property.images = JSON.parse(property.images);
    }
  });

  res.render("category", {
    page: `${category.name}s for Sale`,
    properties,
    csrfToken: req.csrfToken(),
  });
};

const notFound = async (req, res) => {
  res.render("404", {
    page: "Not Found",
    csrfToken: req.csrfToken(),
  });
};
const searcher = async (req, res) => {
  const { word } = req.body;

  if (!word.trim()) {
    return res.redirect("back");
  }

  const properties = await Property.findAll({
    where: {
      title: {
        [Sequelize.Op.like]: "%" + word + "%",
      },
    },
    include: [{ model: Price, as: "price" }],
  });

  properties.forEach((property) => {
    if (typeof property.images === "string") {
      property.images = JSON.parse(property.images);
    }
  });

  res.render("search", {
    page: "Search Results",
    properties,
    csrfToken: req.csrfToken(),
  });
};

export { init, category, notFound, searcher };
