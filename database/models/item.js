const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  storedIn: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  isContainer: {
    type: Boolean,
    default: false,
  },
});

module.exports = new mongoose.model("Item", itemSchema);
