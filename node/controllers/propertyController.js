import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Category, Price, Property } from "../models/index.js";

const admin = async (req, res) => {
  const { id } = req.user;

  const properties = await Property.findAll({
    where: {
      userId: id,
    },
    include: [
      {
        model: Category,
        as: "category",
      },
      {
        model: Price,
        as: "price",
      },
    ],
  });

  properties.forEach((property) => {
    if (typeof property.images === "string") {
      property.images = JSON.parse(property.images);
    }
  });

  res.render("properties/admin", {
    page: "My Properties",
    csrfToken: req.csrfToken(),
    properties,
  });
};

const create = async (req, res) => {
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/create", {
    page: "Create Property",
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: {},
  });
};

const store = async (req, res) => {
  // Validation
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/create", {
      page: "Create Property",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  const {
    title,
    description,
    category,
    price,
    rooms,
    wcs,
    street,
    parkings,
    lat,
    lng,
    price: priceId,
    category: categoryId,
  } = req.body;

  const { id: userId } = req.user;

  try {
    const storedProperty = await Property.create({
      title,
      description,
      categoryId: category,
      priceId: price,
      rooms,
      street,
      wcs,
      parkings,
      lat,
      lng,
      priceId,
      categoryId,
      userId,
      images: "",
    });

    const { id } = storedProperty;

    return res.redirect(`/properties/add-image/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const addImage = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  if (property.is_published) {
    return res.redirect("/my-properties");
  }

  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  res.render("properties/add-image", {
    page: `Add Image: ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
  });
};

const storeImage = async (req, res, next) => {
  const { id } = req.params;

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  if (property.is_published) {
    return res.redirect("/my-properties");
  }

  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  try {
    const files = req.files.map((file) => file.filename);

    const images = JSON.stringify(files);

    property.images = images;
    property.is_published = true;

    await property.save();

    next();
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/edit", {
    page: `Edit Property: ${property.title}`,
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: property,
  });
};

const update = async (req, res) => {
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/edit", {
      page: "Edit Property",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  const { id } = req.params;

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  try {
    const {
      title,
      description,
      category,
      price,
      rooms,
      wcs,
      street,
      parkings,
      lat,
      lng,
      price: priceId,
      category: categoryId,
    } = req.body;

    property.set({
      title,
      description,
      rooms,
      wcs,
      street,
      parkings,
      lat,
      lng,
      priceId,
      categoryId,
    });

    await property.save();

    res.redirect("/my-properties");
  } catch (error) {
    console.log(error);
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  try {
    JSON.parse(property.images).forEach(async (image) => {
      await unlink(`public/uploads/${image}`);
    });
  } catch (error) {
    console.log(error);
  }

  await property.destroy();

  res.redirect("/my-properties");
};

const showProperty = async (req, res) => {

  const { id } = req.params;

  const property = await Property.findByPk(id, {
    include: [
      {
        model: Category,
        as: "category",
      },
      {
        model: Price,
        as: "price",
      },
    ],
  });

  if (!property) {
    return res.redirect("/404");
  }

  if (typeof property.images === "string") {
    property.images = JSON.parse(property.images);
  }

  res.render("properties/show", {
    property,
    page: property.title,
  });
};

export {
  admin,
  create,
  store,
  addImage,
  storeImage,
  edit,
  update,
  deleteProperty,
  showProperty,
};
