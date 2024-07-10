import express from "express";
import { body } from "express-validator";
import {
  addImage,
  admin,
  create,
  store,
  storeImage,
  edit,
  update,
  deleteProperty,
  showProperty,
  sendMessage,
  showMessages,
  changeStatus,
} from "../controllers/propertyController.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/uploadImage.js";
import identifyUser from "../middleware/identifyUser.js";

const router = express.Router();

router.get("/my-properties", protectRoute, admin);

router.get("/properties/create", protectRoute, create);

router.post(
  "/properties/create",
  protectRoute,
  body("title").notEmpty().withMessage("Title is required"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 200 })
    .withMessage("Description is too long"),
  body("category").isNumeric().withMessage("Category is required"),
  body("price").isNumeric().withMessage("Price is required"),
  body("rooms").isNumeric().withMessage("Rooms is required"),
  body("wcs").isNumeric().withMessage("WCs is required"),
  body("parkings").isNumeric().withMessage("Parking is required"),
  body("lat").notEmpty().withMessage("Property location is required"),
  store
);

router.get("/properties/add-image/:id", protectRoute, addImage);

router.post(
  "/properties/add-image/:id",
  protectRoute,
  upload.any(),
  storeImage
);

router.get("/properties/edit/:id", protectRoute, edit);

router.post(
  "/properties/edit/:id",
  protectRoute,
  body("title").notEmpty().withMessage("Title is required"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 200 })
    .withMessage("Description is too long"),
  body("category").isNumeric().withMessage("Category is required"),
  body("price").isNumeric().withMessage("Price is required"),
  body("rooms").isNumeric().withMessage("Rooms is required"),
  body("wcs").isNumeric().withMessage("WCs is required"),
  body("parkings").isNumeric().withMessage("Parking is required"),
  body("lat").notEmpty().withMessage("Property location is required"),
  update
);

router.post("/properties/deleteProperty/:id", protectRoute, deleteProperty);

router.put("/properties/:id", protectRoute, changeStatus);

router.get("/property/:id", identifyUser, showProperty);

router.post(
  "/property/:id",
  identifyUser,
  body("message")
    .isLength({ min: 10 })
    .withMessage("The message cannot be empty or is very short"),
  sendMessage
);

router.get("/messages/:id", protectRoute, showMessages);

export default router;
