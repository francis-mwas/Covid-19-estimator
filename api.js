const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use(
  morgan("tiny", {
    stream: fs.createWriteStream("./logs.txt", { flags: "a" })
  })
);

app.listen(port, () => {
  console.log(`App up and running on port: ${port}`);
});
