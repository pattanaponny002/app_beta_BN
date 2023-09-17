const express = require("express");

const router = express.Router();

const Event_model = require("../models/event_model");
router.get("/get_all_event", async (req, res) => {
  try {
    const result = await Event_model.find({
      author_id: { $exists: true },
    });
    res.status(200).json({ message: "Fetch event", result });
  } catch (err) {
    console.log("ERROR ", err);
    res.status(200).json({ message: "Failed fetching event", err });
  }
});
router.post("/set_event", async (req, res) => {
  const { author_id, author, author_image, date, user, type } = req.body;
  console.log("selectedType");
  try {
    const result = await Event_model.create(
      {
        author_id,
        author,
        author_image,
        date,
        user,
        type: type,
        read: [],
      },
      { new: true }
    );
    console.log("[SET-EVENT] -RETURN", result[0]);

    res.status(200).json({ message: "congrad saved event", result: result[0] });
  } catch (err) {
    console.log(err);
    res.json({ message: "failed event", err });
  }
});
async function Alreadyadded(req, res, next) {
  const { id } = req.params;

  const { reader_id } = req.body;

  console.log("FINDBY ID", id, "READSER ID", reader_id);
  const result = await Event_model.findById(id);

  const { read } = result;

  const checked = read.includes(reader_id);

  if (checked) {
    const updated_result = await Event_model.find({
      _id: { $exists: true },
    });

    const read_checked = updated_result.map((item, index) => item.read);

    /// sending back item read-type
    res.status(200).json({ message: "Found adding", checked, read_checked });
  } else if (checked || read.length === 0) {
    console.log("[EVENT-ROUTE]-BY passing NONE");
    next();
  } else {
    console.log("[EVENT-ROUTE]-BY NOT CHECKED ");
    next();
  }
}
router.patch("/update_notification/:id", Alreadyadded, async (req, res) => {
  const { id } = req.params;

  const { reader_id } = req.body;
  console.log("[EVENT-ROUTE]-UPDATE _NOTIFICATION", id, reader_id);

  try {
    const result = await Event_model.findByIdAndUpdate(
      id,
      { $push: { read: [reader_id] } },
      { new: true }
    );
    console.log("ID", result);
    const { read } = result;

    const read_checked = read.includes(reader_id);

    if (read_checked) {
      const updated_result = await Event_model.find({
        _id: { $exists: true },
      });

      const read_checked = updated_result.map((item, index) => item.read);

      console.log("[EVENT-ROUTE]-Read", read_checked);
      res.status(200).json({ message: "Fetch event", read_checked });
    }

    // undefinded
  } catch (err) {
    console.log("ERROR ", err);
    res.json({ message: "Failed fetching event", err });
  }
});

module.exports = router;
