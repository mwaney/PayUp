const express = require("express");
const router = express.Router();
const { generateToken, stkPush } = require("../controllers/token");

router.post("/", generateToken, stkPush);

module.exports = router;
