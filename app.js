import fs from "fs";
const path = require("path");
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import covidRouter from "./routes/covididRoute";

const app = express();

dotenv.config();

//1: MIDDLEWARES.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs/access.log"),
  { flags: "a" }
);
app.use(
  morgan(":method\t\t:url\t\t:status\t\t0:total-time[0]ms", {
    stream: accessLogStream
  })
);

// app.use(
//   morgan("tiny", {
//     stream: fs.createWriteStream("./logs.txt", { flags: "a" })
//   })
// );
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1/on-covid-19", covidRouter);

app.use("*", (req, res) => {
  return res.status(404).json({
    Message: "Welcome to COVID19-ESTIMATOR"
  });
});

export default app;
