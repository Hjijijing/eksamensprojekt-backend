const express = require("express");
const router = express.Router();
const database = require("../database/database");
const multer = require("multer");
const upload = multer();

const parseItem = (req, res, next) => {
  if (req.file) {
    req.image = { data: req.file.buffer, contentType: req.file.mimetype };
  }
  if (req.body.item) {
    req.item = JSON.parse(req.body.item);
  }

  next();
};

//Get items
router.get("/", (req, res) => {
  res.json(database.getItems());
});

//Create items
router.post("/", upload.single("image"), parseItem, (req, res) => {
  const itemData = { image: req.image, ...req.item };
  database.createItem(itemData);
  res.sendStatus(200);
});

//TODO: Only put changes and not everything
//Update items
router.put("/:id/", upload.single("image"), parseItem, (req, res) => {
  const newItemData = { image: req.image, ...req.item };
  database.updateItem(req.params.id, newItemData);
  res.sendStatus(200);
});

//Delte items
router.delete("/:id/", (req, res) => {
  database.deleteItem(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
