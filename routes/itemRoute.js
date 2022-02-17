const express = require("express");
const router = express.Router();
const database = require("../database/database");

//Get items
router.get("/", (req, res) => {
  res.json(database.getItems());
});

router.post("/", (req, res) => {
  console.log(req.body);
  database.createItem(req.body);
  res.sendStatus(200);
});

module.exports = router;
