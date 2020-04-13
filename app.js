import fs from "fs";
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
app.use(
  morgan("tiny", {
    stream: fs.createWriteStream("./logs.txt", { flags: "a" })
  })
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1/on-covid-19", covidRouter);

app.use("*", (req, res) => {
  return res.status(404).json({
    Message: "URL DOES NOT EXIST, Please counter check"
  });
});

export default app;
