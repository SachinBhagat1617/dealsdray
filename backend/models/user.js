const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxLength: [40, "Name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provise a email"],
    validate: [validator.isEmail, "Please provide correct email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minLength: [6, "password must be of atleast 6 char"],
    select: false,
  },
  createdAT: {
    type: String,
    default: Date.now,
  },
});

userSchema.methods.getJwtToken = () => {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
