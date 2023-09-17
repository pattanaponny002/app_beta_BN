const mongoose = require("mongoose");

const thread_model = new mongoose.Schema({
  id: {
    type: String,
  },
  content: {
    type: String,
  },
  first_name: {
    type: String,
  },

  profile_url: {
    type: String,
  },
  bio: {
    type: String,
  },
});

const event_model = new mongoose.Schema(
  {
    author: {
      type: String,
    },
    author_id: {
      type: String,
    },
    author_image: {
      type: String,
    },
    date: {
      type: String,
    },
    user: [thread_model],
    type: {
      type: String,
    },
    read: [String], // id
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", event_model);
