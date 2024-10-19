import {Request, Response, NextFunction} from "express";
import User from "../models/user.ts"; // Import your User model

// Middleware to log each request
const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString(); // Get the current timestamp
  console.log(`\nREQUEST ${req.method} :  ${req.url}  [${timestamp}] `); // Log the HTTP method and endpoint

  next(); // Proceed to the next middleware or route handler
};

const fetchRecentUsers = async (): Promise<void> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Calculate the date 7 days ago

  try {
    const recentUsers = await User.find({
      createdAt: {$gte: sevenDaysAgo}, // Filter users created in the last 7 days
    });

    console.log(`Users registered in the last 7 days: ${recentUsers.length}`);
    recentUsers.forEach((user) => {
      console.log(
        `\nUser: ${user.name}, Email: ${user.email}, Registered At: ${user.createdAt}`
      );
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
  }
};

export default {requestLogger, fetchRecentUsers};
