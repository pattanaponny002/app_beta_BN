const express = require("express");

const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TEST = require("./models/TEST");
const MarkedDate = require("./models/MarkedDate");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const http = require("http");

const { Server } = require("socket.io");
const register_Api = require("./routes/TEST_route");
const codeauth_api = require("./routes/CODE_AUTH_routes");
const event_api = require("./routes/event_routes");
const port = 4000;
const fs = require("fs");
const https = require("http");
// const open = require("open");
// const { google } = require("googleapis");
// const client = require("twilio")(twilo_auth_sid, twilo_auth_token);
const cors = require("cors");
const cookey_parser = require("cookie-parser");
dotenv.config();
const twilo_auth_sid = process.env.TWILO_AUTH_SID;
const twilo_auth_token = process.env.TWILO_AUTH_TOKEN;

const stripe_live_key = process.env.SECRET_LIVE_KEY;
const stripe_test_key = process.env.SECRET_TEST_KEY;

const stripe = require("stripe")(stripe_live_key);

const client = require("twilio")(twilo_auth_sid, twilo_auth_token);
// const oauth2Client = new google.auth.OAuth2(
//   clientId,
//   clientSecret,
//   redirectUrl
// );
// const spdy = require("spdy");
// const server = spdy.createServer({}, app);
const server = http.createServer(app);

// const options = {
//   key: fs.readFileSync(__dirname + "/server.key"),
//   cert: fs.readFileSync(__dirname + "/server.crt"),
// };
const redisAdapter = require("socket.io-redis");

const nodemailer = require("nodemailer");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DATEBASE MONGODB MASTER is connecting 15");
  });
app.use(express.json());
app.use(cookey_parser());
app.use(
  cors({
    methods: "*",
  })
);

app.use("/test/api", register_Api);
app.use("/codeauth/api", codeauth_api);
app.use("/event/api", event_api);
const io = new Server(server, { pingInterval: 20000, pingTimeout: 5000 });
// io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

// io.of("/common").use((socket, next) => {
//   console.log("socket", socket.id);
//   next();
// });
let users = [];
function add_user(userId, socketID) {
  const cheked = users.some((user) => user.userId === userId);

  console.log("new user", userId, users, cheked);
  !cheked && users.push({ userId, socketID });

  return users;
}

function remove_function(socketID) {
  const remove_user = users.find((user) => user.socketID === socketID);
  users = users.filter((user) => user.socketID !== socketID);

  return { remove_user, users };
}

io.of("/common").on("connection", (socket) => {
  console.log(socket.id, "is connected");
  socket.on("add_user", (userID) => {
    const added_user = add_user(userID, socket.id);

    io.of("/common").emit("get_user", added_user);
  });

  socket.on("logout", () => {
    console.log("LOGOUT", socket.id);
    const { remove_user, users } = remove_function(socket.id);

    remove_user && console.log("remove user_ID", remove_user);
    remove_user && io.of("/common").emit("get_user", users);
  });

  socket.on("disconnect", () => {
    console.log("DISCONNECT", socket.id);
    const { remove_user, users } = remove_function(socket.id);

    remove_user && console.log(remove_user, "discconected");
    remove_user && io.of("/common").emit("get_user", users); //checked;
  });

  socket;
  socket.on("get_welcome", (message, cb) => {
    console.log("message : ", message);
    cb({ message: "callback" });
    const message_callback = {
      message: "send emit",
    };
    socket.emit("send_Welcome", message_callback);
  });
  socket.on("get_message", (message) => {
    console.log(message);
    console.log("ROOMS", socket.rooms);
    socket.broadcast.emit("sendback_message", message);
  });

  socket.on("send_event", (event_content) => {
    //change it to io
    console.log("SOCKET EVENT RECEIVE", event_content);
    io.of("/common").emit("get_event", event_content);
  });
});

io.of("/chat").on("connection", (socket) => {
  console.log("chat is connected", socket.id);
});
io.of("/customer_chat").on("connection", (socket) => {
  console.log("customer_chat is connected", socket.id);
});
/////
// const authUrl = oauth2Client.generateAuthUrl({
//   access_type: "offline",
//   scope: SCOPES,
// });
// app.get("/oauth2callback", async (req, res) => {
//   const code = req.query.code;

//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);

//   console.log("Tokens:", tokens);

//   res.send("Authentication successful! You can close this window.");
// });

// app.get("/", (req, res) => {
//   const { code } = req.query;
//   console.log("code", code);
// });
// app.get("/callback", (req, res) => {
//   const { code } = req.query;

//   console.log("callback");
//   // const YOUR_CLIENT_ID =
//   //   "454658414444-ep5rirldgb2fa30q96gvlhu2v739caj2.apps.googleusercontent.com";

//   const YOUR_REDIRECT_URI = "http://localhost:4000/callback";
//   const YOUR_CLIENT_SECRET = "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";
//   // const YOUR_REDIRECT_URI = "http://localhost:4000/callback";

//   const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${YOUR_CLIENT_ID}&client_secret=${YOUR_CLIENT_SECRET}&redirect_uri=${YOUR_REDIRECT_URI}&grant_type=authorization_code`;

//   // const { id_token } = data;

//   // verify the id token
//   // const verifyResponse = await fetch(
//   //   `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
//   // );

//   // const verifyData = await verifyResponse.json();
//   // console.log("verifyData : ", verifyData);
//   //fetching get {id_token}
//   //   const { name, email, picture } = verifyData;

//   //   // This res.send is the key to redirecting back to our expo go app.
//   // // ex: you have to enter your IP adress that is running your expo go application.
//   //   res.send(`<script>window.location.replace("exp://?email=${email}&name=${name}&picture=${picture}")</script>`);
// });
app.get("/", (req, res) => {
  console.log("GET");

  res.json({ message: "CHANGING CODE" });
});
app.post("/request_code", async (req, res) => {
  const { email } = req.body;
  console.log("request to code", email);
  let CODE = "";

  const digit = "0123456789ABZDEFGHIJKLFTUVWXYZ";
  for (let i = 0; i < 4; i++) {
    CODE += digit[Math.floor(Math.random() * digit.length)];
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "609475016@gms.tku.edu.tw",
      pass: "xxzwsmwktvbgklic",
    },
  });
  // oloponnyolo@gmail.com lrhaodoktqhwgphc
  // 609475016@gms.tku.edu.tw xxzwsmwktvbgklic
  try {
    const message = await transporter.sendMail({
      from: "609475016@gms.tku.edu.tw",
      to: email,
      subject: "Verification Code",
      text: "hello man",
      html: ` 
          <h1>EMAIL</h1>
          <p style="color: purple; font-size: 2rem; font-weight: 900">${CODE}</p>
       `,
    });
    res.json({ message, CODE });
  } catch (err) {
    console.log(err);
    res.json({ message: "Failed sending message", err });
  }
});

///

app.get("/mailer", async (req, res) => {
  let OTP = "";

  const digit = "0123456789";
  for (let i = 0; i < 6; i++) {
    OTP += digit[Math.floor(Math.random() * digit.length)];
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "609475016@gms.tku.edu.tw",
      pass: "xxzwsmwktvbgklic",
    },
  });
  // ponny lrhaodoktqhwgphc
  // 609 xxzwsmwktvbgklic
  try {
    const message = await transporter.sendMail({
      from: "609475016@gms.tku.edu.tw",
      to: "oloponnyolo@gmail.com",
      subject: "Verification Test",
      text: "hello man",
      html: ` 
          <h1>VERIFICATION FROM  PONNY XX</h1>
          <p style="color: pink; font-size: 2rem; font-weight: 900">${OTP}</p>
       `,
    });
    res.json({ message, OTP });
  } catch (err) {
    console.log(err);
    res.json({ message: "Failed sending message", err });
  }
});
/// stripe
app.get("/sms/:phone_number", (req, res) => {
  const { phone_number } = req.params;
  let OTP = "";
  console.log("phone_number", phone_number);
  const digit = "0123456789";
  for (let i = 0; i < 6; i++) {
    OTP += digit[Math.floor(Math.random() * digit.length)];
  }
  if (phone_number) {
    client.messages
      .create({
        body: `This is the OTP ${OTP} number, please ensure that the otp keep in secret and only use for authentication..`,
        from: "+14843226506",
        to: `${phone_number}`,
      })
      .then((message) => console.log(message.sid));

    res.json({ message: "succesfully", OTP });
  } else {
    res.json({ message: "no phone number request" });
  }
});

app.post("/payment", async (req, res) => {
  const { amount } = req.body;
  console.log("amount", amount);

  // const customer = await stripe.customers.create();
  // const ephemeralKey = await stripe.ephemeralKeys.create(
  //   {customer: customer.id},
  //   {apiVersion: '2022-11-15'}
  // );

  const customer = await stripe.customers.create({
    email: "oloponnyolo@gmail.com",
  });
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );
  console.log("detailed", customer);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // "10THB"
    customer: customer.id,
    currency: "thb",
    payment_method_types: [],
  });

  const setupIntents = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types: ["card"],
  });
  console.log("INFO", setupIntents);

  // [2] take a payment key
  // const clientSecret = paymentIntent.client_secret;
  // console.log(clientSecret);
  const setupIntent = setupIntents.client_secret;
  // res.json({ clientSecret, ephemeralKey, customer: customer.id });
  res.json({ setupIntent, ephemeralKey, customer: customer.id });
});
app.post("/test_saveImage", async (req, res) => {
  const newFormatted = req.body;
  console.log(newFormatted);
  const result = await MarkedDate.create(newFormatted);
  res.json({ message: "done", result });
});
app.get("/fetch_saveImage", async (req, res) => {
  console.log("fetch");
  const result = await MarkedDate.find({
    date: { $exists: true },
  });
  res.json({ message: "done", result });
});
////socket

/// you wanna use socket.io have to change this to server
server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running   on port  ${port}`);
});

//socket. io

//stripe

//jwt // bcryps // passed
