import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routing/user-routes.js";

const app = express();

dotenv.config();

const password = process.env.DATABASE_PASSWORD;

if (!password) {
  throw new Error("DATABASE_PASSWORD is missing in backend/.env");
}

//middleware
app.use(express.json());
app.use("/user", userRouter);

//connections
mongoose
  .connect(
    `mongodb+srv://yanakarpovych0707_db_user:${encodeURIComponent(password)}@cluster0.ppnqwkq.mongodb.net/`,
  )
  .then(() =>
    app.listen(5000, () =>
      console.log(
        "Connection successful & Listening to localhost on Port 5000",
      ),
    ),
  )
  .catch((err: unknown) => console.log(err));
