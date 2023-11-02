import jwt from "jsonwebtoken";
import { CatchAsyncError } from "./CatchAsyncErrors.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { User } from "../Model/User.js";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return next(new ErrorHandler("Not Logged In", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
});

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is mnot allow to access this resourse`,
        403
      )
    );

  next();
};
