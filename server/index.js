const express = require("express");
const app = express();
const cors = require("cors");
const GetTokenRoute = require("./routes/token");
const { callback } = require("./controllers/token");

app.use(express.json());

app.use(cors());
app.use("/getToken", GetTokenRoute);

app.get("/", (req, res) => {
  res.send("Getting ready to pay you");
});

app.post("/callback", callback);
app.listen(6060, () => {
  console.log("App listening on port 6060...");
});
