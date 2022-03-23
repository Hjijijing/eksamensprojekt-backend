const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
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
    image: {
      data: Buffer,
      contentType: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Item", itemSchema);
