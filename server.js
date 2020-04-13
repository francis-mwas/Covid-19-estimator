import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

// database configuration and connection
// const DB = process.env.DATABASE_LOCAL;
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("DB connection successful!");
//   })
//   .catch(err => {
//     console.log("an erro occurred:  ", err);
//   });

// START THE SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
