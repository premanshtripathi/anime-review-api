// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("❌ App is not Listening !! Error: ", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`\n⚙️  Server is listening at port: ${PORT}`);

      console.log(`\nApi Documentation at http://localhost:8000/api-docs`);
    });
  })
  .catch((error) => {
    console.log("❌ MongoDB connection failed: ", error);
  });
