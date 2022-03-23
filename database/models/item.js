const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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

const encKey = process.env.ENCRYPTION_KEY;
const signKey = process.env.SIGNING_KEY;

itemSchema.plugin(encrypt, {
  requireAuthenticationCode: false,
  encryptionKey: encKey,
  signingKey: signKey,
});

module.exports = new mongoose.model("Item", itemSchema);
