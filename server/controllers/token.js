const axios = require("axios");
require("dotenv").config();

const generateToken = async (req, res, next) => {
  const consumerKey = process.env.CONSUMER;
  const secretKey = process.env.SECRET;
  const auth = new Buffer.from(`${consumerKey}:${secretKey}`).toString(
    "base64"
  );

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    console.log(response.data);
    const token = response.data.access_token;
    req.token = token;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
};

const stkPush = async (req, res) => {
  const shortCode = "174379";
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  const passkey = process.env.PASSKEY;
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + date.getMonth() + 1).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  console.log("Timestamp: ", timestamp);

  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: shortCode,
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://c8b0-102-217-157-211.ngrok-free.app/callback",
    AccountReference: "PayUp",
    TransactionDesc: "Use PayUp app to make stk push payments",
  };

  if (req.token) {
    try {
      const token = req.token;
      const response = await axios.post(url, payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      res.status(200).send(response.data);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  } else {
    res.status(500).send("Token not available");
  }
};

const callback = (req, res) => {
  const callbackData = req.body;
  const stkCallback = callbackData.Body.stkCallback;
  if (!stkCallback) {
    console.log(callbackData);
    return res.json("ok");
  }
  const metaData = stkCallback.CallbackMetadata;
  if (!metaData) {
    console.log(callbackData);
    return res.json("ok");
  }
  console.log(metaData);
};

module.exports = { generateToken, stkPush, callback };
