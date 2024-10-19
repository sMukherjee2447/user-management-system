/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpStatus from "http-status";
dotenv.config();

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      STATUSCODE: HttpStatus.BAD_REQUEST,
      message: "Access denied, no token provided",
      response_data: {},
    });
    return; // This ensures that the function exits here, but does not "return" the response itself
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    (req as any).user = decoded; // Attach the user data to the request object
    next(); // Proceed to the next middleware or route handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      STATUSCODE: HttpStatus.UNAUTHORIZED,
      message: "Invalid or expired token",
      response_data: {},
    });
    return; // Exit the function after sending the response
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user; // The user should be attached by the authenticateJWT middleware

  // if (user.role != "super_admin") {
  //   console.log("role =>", user.role);
  //   res
  //     .status(HttpStatus.FORBIDDEN)
  //     .json({message: "Access denied, admin only."});
  //   return;
  // }
  if (user.role == "super_admin" || user.role == "sub_admin") {
    next();
  } else {
    res.status(HttpStatus.FORBIDDEN).json({message: "Access denied"});
    return; // Exit the function after sending the response
  }
};
