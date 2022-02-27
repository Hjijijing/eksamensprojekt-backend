const express = require("express");
const router = express.Router();
const database = require("../database/database");
const multer = require("multer");
const upload = multer();

//Get items
router.get("/", (req, res) => {
  res.json(database.getItems());
});

router.post("/", (req, res) => {
  console.log(req.body);
  database.createItem(req.body);
  res.sendStatus(200);
});

router.put("/:id/", (req, res) => {
  database.updateItem(req.params.id, req.body);
  res.sendStatus(200);
});

router.delete("/:id/", (req, res) => {
  database.deleteItem(req.params.id);
  res.sendStatus(200);
});

router.post("/test/", upload.single("image"), (req, res) => {
  console.log(req.file);
});

module.exports = router;
