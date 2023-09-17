const mongoose = require("mongoose");

const SUB_ADDRESS = new mongoose.Schema({
  alley: {
    type: String,
  },
  city: {
    type: String,
  },
  code: {
    type: Number,
  },
});
const TEST = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  address: SUB_ADDRESS,
  read: {
    type: [String],
  },
});

module.exports = mongoose.model("TEST", TEST);
