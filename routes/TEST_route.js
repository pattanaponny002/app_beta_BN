const express = require("express");

const router = express.Router();
const TEST = require("../models/TEST");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("mongoDB on TEST MODEL is connecting");
//   });
router.delete("/delete", async (req, res) => {
  // const datas = [
  //   { username: "master", password: "some" },
  //   { username: "master22", password: "some44" },
  //   { username: "master33", password: "some44" },
  // ];
  const result = await TEST.deleteMany({
    username: { $exists: true },
  });

  res.json({ message: "delete_collection", result });
});
router.get("/register_collection", async (req, res) => {
  const datas = [
    { username: "master", password: "some" },
    { username: "master22", password: "some44" },
    { username: "master33", password: "some44" },
  ];
  const result = await TEST.insertMany(datas);

  res.json({ message: "created collections", result });
});
router.post("/register", async (req, res) => {
  const { username, password, age } = req.body;

  console.log(username, password);
  const salt = await bcryptjs.genSalt(10);

  const hash_password = await bcryptjs.hash(password, salt);

  console.log("hash_password", hash_password);
  const result = await TEST.create({
    username,
    password: hash_password,
    age,
    address: {
      alley: "9",
      city: "phukey",
      code: 99,
    },
    read: [],
  });
  res.json({ message: "CREATED", result });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params; // name

  const result = await TEST.findByIdAndUpdate(
    { _id: id },
    { $push: { read: ["master"] } }
  );
  res.json({ message: "UPDATED", result });
});
router.delete("/", async (req, res) => {
  console.log("delete", req.query.master);
  res.json({ message: "HEllo" });
});

async function authentication(req, res, next) {
  const jwt_code = req.cookies.accessToken;
  jwt.verify(jwt_code, process.env.JWT_SECRET, (err, username) => {
    if (!err) {
      req.user = username;
      next();
    } else {
      res.json({ message: "Failed to authenticate", err });
    }
  });
}
router.get("/", authentication, async (req, res) => {
  console.log("hello", req.user);

  /// sing {username,process} salt always behind
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  //find first

  const result = await TEST.find({
    username,
  });
  console.log("RESULT", result);

  if (!result) {
    res.status(400).json({ message: "notFound" });
  } else {
    console.log(result.password, process.env.JWT_SECRET);
    const checked = await bcryptjs.compare(password, result.password);
    console.log(checked);
    if (checked) {
      const jwt_code = await jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "30s",
      });

      console.log("jwt_code", jwt_code);

      res
        .cookie("accessToken", jwt_code, { httpOnly: true })
        .json({ message: "login", checked });
    } else {
      res.json({ message: "notFound" });
    }
  }
});
router.get("/checked/:username", async (req, res) => {
  const { username } = req.params;
  console.log("username", username);

  const reg = new RegExp(username, "g");
  const result = await TEST.find({
    username: { $regex: reg },
  });

  if (result.length > 0) {
    res.json({ message: "found", result });
  } else {
    res.json({ message: "not found", result });
  }
});
router.get("/find_collection", async (req, res) => {
  // const datas = [
  //   { username: "master", password: "some" },
  //   { username: "master22", password: "some44" },
  //   { username: "master33", password: "some44" },
  // ];
  const result = await TEST.find({
    username: { $exists: true },
  });

  res.json({ message: "find_collection", result });
});

module.exports = router;
