const express = require("express");
const router = express.Router();
const database = require("../database/database");
const multer = require("multer");
const upload = multer();
const { getUser, requireAuth } = require("../firebase/firebaseAuth");

const parseItem = (req, res, next) => {
  if (req.file) {
    req.image = { data: req.file.buffer, contentType: req.file.mimetype };
  }
  if (req.body.item) {
    req.item = JSON.parse(req.body.item);
  }

  next();
};

const printReq = (req, res, next) => {
  console.log(req.body.image);
  console.log(typeof req.body.image);
  return next();
};

//Get items
router.get("/", getUser, (req, res) => {
  res.json(database.getItems(req.user));
});

router.get("/user", getUser, (req, res) => {
  res.json(req.user);
});

//Create items
router.post(
  "/",
  upload.single("image"),
  parseItem,
  getUser,
  requireAuth,
  (req, res) => {
    const itemData = { image: req.image, ...req.item };
    database.createItem(itemData, req.user);
    res.sendStatus(200);
  }
);

//TODO: Only put changes and not everything
//Update items
router.put(
  "/:id/",
  upload.single("image"),
  printReq,
  parseItem,
  getUser,
  requireAuth,
  (req, res) => {
    const newItemData = { image: req.image, ...req.item };
    database.updateItem(req.params.id, newItemData, req.user);
    res.sendStatus(200);
  }
);

// router.get("/test", getUser, (req, res) => {
//   console.log(req.user);
//   res.sendStatus(201);
// });

//Delte items
router.delete("/:id/", getUser, requireAuth, (req, res) => {
  database.deleteItem(req.params.id, req.user);
  res.sendStatus(200);
});

module.exports = router;
