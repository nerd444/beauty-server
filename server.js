const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const review = require("./routes/review");
const reservation = require("./routes/reservation");
const user = require("./routes/user")

const app = express();

app.use(express.json());
app.use("/api/v1/review", review);
app.use("/api/v1/reservation", reservation);
app.use("/api/v1/user",user)
const PORT = process.env.PORT;

app.listen(PORT, console.log("개발시작"));
