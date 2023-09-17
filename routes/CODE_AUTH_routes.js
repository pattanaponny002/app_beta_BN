const express = require("express");

const router = express.Router();
const CODE_AUTH = require("../models/CODE_AUTH");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

function generatorCode(amount, pattern) {
  let OTP = "";
  const digit = pattern ? pattern : "0123456789";

  for (let i = 0; i < amount; i++) {
    OTP += digit[Math.floor(Math.random() * digit.length)];
  }

  return OTP;
}
router.get("/request_auth_code/:email", async (req, res) => {
  const { email } = req.params;

  const code_pattern = "0123456789ABZDEFGHIJKLFTUVWXYZ";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "609475016@gms.tku.edu.tw",
      pass: "xxzwsmwktvbgklic",
    },
  });

  const code_auth = generatorCode(4, code_pattern);
  console.log("code_auth", code_auth);

  try {
    const message = await transporter.sendMail({
      from: "609475016@gms.tku.edu.tw",
      to: email,
      subject: "Verification Code",
      text: "hello man",
      html: ` 
        <h1>EMAIL</h1>
        <p style="color: purple; font-size: 2rem; font-weight: 900">${code_auth}</p>
     `,
    });
    //// saving auth
    // const result = await CODE_AUTH.create({
    //   code_auth,
    // });
    res.status(200).json({ message, code_auth });
  } catch (err) {
    console.log("Failed register auth code", err);
    res.json({ message: "Failed Request Auth", err });
  }
});
/// if they can authenticate the email so then save the email

async function checkEmailExist(req, res, next) {
  const { email, code_auth } = req.body;
  console.log("CHECKED FIRST", email, code_auth);
  const result = await CODE_AUTH.findOne({
    email,
  });

  if (result) {
    res.status(200).json({
      message: "Found One",
      result,
      email: result.email,
      exist: true,
    });
  } else {
    next();
  }
}
router.post("/save_email", checkEmailExist, async (req, res) => {
  const { email, code_auth } = req.body;

  console.log("SAVING EMAIL", email);

  try {
    const result = await CODE_AUTH.create({
      code_auth,
      email,
    });

    res.status(200).json({
      message: "Saved Email successfully",
      email: email,
      code_auth: code_auth,
      result,
      exist: false,
    });
  } catch (err) {
    res.json({ message: "Failed Saving Email successfully", err });
  }
});

/// if they can authenticate the phone_number so then save the email

async function checkedPhoneExist(req, res, next) {
  const { phone_number, OTP_digits } = req.body;
  console.log("CHECKED FIRST PHONE", phone_number, OTP_digits);
  const result = await CODE_AUTH.findOne({
    phone_number,
  });

  if (result) {
    res.status(200).json({
      message: "Found One",
      result,
      phone_number: result.phone_number,
      exist: true,
    });
  } else {
    console.log("NOT EXIST YET");
    next();
  }
}
router.post("/save_phone_number", checkedPhoneExist, async (req, res) => {
  const { phone_number, OTP_digits } = req.body;
  console.log("SAVE PHOENNUMBEr", phone_number, OTP_digits);
  try {
    const result = await CODE_AUTH.create({
      OTP_digits,
      phone_number,
    });
    res.status(200).json({
      message: "saved phone number",
      result,
      phone_number,
      OTP_digits,
    });
  } catch (err) {
    console.log("saved phone error", err);
    res.json({ message: "saved phone number", err });
  }
});

//// adding username and profile-image

router.post("/add_information", async (req, res) => {
  const { username, image_url, _id } = req.body;
  console.log("ADD INFORMATION", req.body);

  try {
    const result = await CODE_AUTH.findOneAndUpdate(
      { _id: _id },
      { $set: { username, image_url } },
      { new: true } // This option returns the updated document
    );
    console.log("ADD INFORMATION", result);
    res
      .status(200)
      .json({ message: "adding image and username successfully", result });
  } catch (err) {
    console.log(err);
    res.json({ failed: "adding image and username successfully", err });
  }
});

///add personal schedule

router.post("/set_schedule", async (req, res) => {
  const { _id, scheduleItem } = req.body;

  console.log("Arraived", _id, scheduleItem);

  try {
    const result = await CODE_AUTH.updateOne(
      { _id },
      { $set: { scheduleItem: scheduleItem } }, // Add the scheduleItem to the array
      { new: true }
    );
    res.status(200).json({
      message: "Already set your schedule",
      scheduleItem: result.scheduleItem,
    });
  } catch (err) {
    console.log(err);
    res.json({ message: "Failed to set your schedule", err });
  }
});

router.get("/retrive_schrdule/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  const result = await CODE_AUTH.findOne({
    _id,
  });

  const scheduleItem = result.scheduleItem;

  res.json({ message: "Retrieved successfully..!!", scheduleItem });
});
router.post("/initialzing_information", async (req, res) => {
  const { _id } = req.body;
  console.log("EMAIL IS EXIST..!!", req.body);
  try {
    const result = await CODE_AUTH.findOne({
      _id,
    });

    res
      .status(200)
      .json({ message: "finding image and username successfully", result });
  } catch (err) {
    res.json({ message: "Failed", err });
  }
});

router.get("/get_available_user", async (req, res) => {
  console.log("hello");
  try {
    const result = await CODE_AUTH.find({
      username: { $exists: true },
    });

    res.json({
      message: "Fetching available users successfully",
      result: result,
    });
  } catch (err) {
    console.log("get_available_user", err);
    res.json({ message: "Failed fetching available users", err });
  }
});
module.exports = router;
