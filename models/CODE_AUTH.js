const mongoose = require("mongoose");

const scheduleItem = new mongoose.Schema(
  {
    days: { type: [String] },
    time: { type: [String] },
    holidays: { type: [String] },
  },
  { timestamps: true }
);
const CODE_AUTH = new mongoose.Schema({
  code_auth: {
    type: String,
  },
  OTP_digits: {
    type: String,
  },
  email: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  username: {
    type: String,
  },
  image_url: {
    type: String,
  },
  scheduleItem: {
    type: scheduleItem,
  },
});

module.exports = mongoose.model("CODE_AUTH", CODE_AUTH);
