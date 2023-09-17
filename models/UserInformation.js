const mongoose = require("mongoose");

const UserInformation = new mongoose.Schema({
  email: {
    type: String,
  },
  phone_number: {
    type: String,
  },
});

module.exports = mongoose.model("UserInformation", UserInformation);
