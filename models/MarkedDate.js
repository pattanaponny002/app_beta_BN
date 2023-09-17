const mongoose = require("mongoose");

const MarkedDate = new mongoose.Schema({
  selected: {
    type: Boolean,
  },
  startingDay: {
    type: Boolean,
  },
  endingDay: {
    type: Boolean,
  },
  selectedColor: {
    type: String,
  },
  color: {
    type: String,
  },
});

const MarkedCollection = new mongoose.Schema({
  author: {
    type: String,
  },
  date: {
    type: String,
  },
  markedDate: {
    type: MarkedDate,
  },
});

module.exports = mongoose.model("MarkedCollection", MarkedCollection);
