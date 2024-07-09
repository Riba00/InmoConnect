import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Category, Price, Property, Message } from "../models/index.js";
import { isSeller } from "../helpers/index.js";

const admin = async (req, res) => {
  const { page: currentPage } = req.query;

  const expresion = /^[1-9]$/;

  if (!expresion.test(currentPage)) {
    return res.redirect("/my-properties?page=1");
  }

  try {
    const { id } = req.user;

    const limit = 10;
    const offset = currentPage * limit - limit;

    const [properties, total] = await Promise.all([
      Property.findAll({
        limit,
        offset,
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
      }),
      Property.count({
        where: {
          userId: id,
        },
      }),
    ]);

    properties.forEach((property) => {
      if (typeof property.images === "string") {
        property.images = JSON.parse(property.images);
      }
    });

    res.render("properties/admin", {
      page: "My Properties",
      csrfToken: req.csrfToken(),
      properties,
      pages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.log(error);
  }
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
    csrfToken: req.csrfToken(),
    user: req.user,
    isSeller: isSeller(req.user?.id, property.userId),
  });
};

const sendMessage = async (req, res) => {
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

  let result = validationResult(req);

  if (!result.isEmpty()) {
    res.render("properties/show", {
      property,
      page: property.title,
      csrfToken: req.csrfToken(),
      user: req.user,
      isSeller: isSeller(req.user?.id, property.userId),
      errors: result.array()
    });
  }

  const { message } = req.body
  const { id: propertyId} = req.params
  const { id: userId} = req.user

  await Message.create({
    message,
    propertyId,
    userId
  })

  res.render("properties/show", {
    property,
    page: property.title,
    csrfToken: req.csrfToken(),
    user: req.user,
    isSeller: isSeller(req.user?.id, property.userId),
    sent: true
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
  sendMessage,
};
