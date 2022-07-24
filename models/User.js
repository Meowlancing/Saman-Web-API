const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      max: 20,
      min: 3,
    },
    isSeller: {
      type: Boolean,
    },
    isBuyer: {
      type: Boolean,
    },
    email: {
      type: STring,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    shopPicture: {
      type: String,
      default: "",
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
