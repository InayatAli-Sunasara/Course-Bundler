import express from "express";
import dotenv, { config } from "dotenv";
import ErrorMiddleware from "./MiddleWare/Error.js";
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./config/config.env",
});
// config({
// path: "./config/config.env",
// });
const app = express();

// Using Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// Importing And Using Routes
import course from "./Routes/CourseRoutes.js";
import user from "./Routes/UserRouter.js";
import payment from "./Routes/PaymentRoutes.js";

app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);

export default app;

app.use(ErrorMiddleware);
