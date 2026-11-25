import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routing/user-routes.js";
import postRouter from "./routing/post-routes.js";
import cors from "cors";
const app = express();
dotenv.config();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = ["http://localhost:5173"];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
const password = process.env.DATABASE_PASSWORD;
if (!password) {
    throw new Error("DATABASE_PASSWORD is missing in backend/.env");
}
//middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/user", userRouter);
app.use("/posts", postRouter);
//connections
mongoose
    .connect(`mongodb+srv://yanakarpovych0707_db_user:${encodeURIComponent(password)}@cluster0.ppnqwkq.mongodb.net/`)
    .then(() => app.listen(port, "0.0.0.0", () => {
    console.log(`Server is listening on port ${port}`);
}))
    .catch((err) => console.log(err));
