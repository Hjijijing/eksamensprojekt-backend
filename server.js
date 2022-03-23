//require("dotenv").config();
require("./firebase/firebaseConfig");
const cors = require("cors");
const express = require("express");
const database = require("./database/database");
const app = express();
const mongoose = require("mongoose");

const itemRoute = require("./routes/itemRoute.js");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/items", itemRoute);

const port = process.env.PORT || 3000;

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("Connection to mongodb failed");
      console.error(err);
      process.abort();
    }
    app.listen(port, () => {
      console.log("App started on port " + port);
      database.createCache();
    });
  }
);
