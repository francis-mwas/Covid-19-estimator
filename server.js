import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

// START THE SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
