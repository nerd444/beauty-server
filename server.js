const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const user = require("./routes/user");
const review = require("./routes/review");

const app = express();

app.use(express.json());
app.use("/api/v1/user", user);
app.use("/api/v1/review", review);

const PORT = process.env.PORT;

app.listen(PORT, console.log("개발시작"));
