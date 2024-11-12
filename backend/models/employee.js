const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    enum: ["HR", "Manager", "Sales"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  courses: {
    type: [String],
    required: true,
    //enum: ["MCA", "BCA", "BSc"],
  },
  image: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);