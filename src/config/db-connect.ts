import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.ts";
import bcrypt from "bcrypt";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {});
    console.log("MongoDB connected");

    const Admin_exists = await User.findOne({role: "super_admin"});
    if (!Admin_exists) {
      const create_new_admin = await User.create({
        name: "Super Admin",
        email: "superAdmin@yopmail.com",
        password: await bcrypt.hash("123456", 10),
        role: "super_admin",
      });
      console.log(`\nSuper Admin Created : ${create_new_admin}`);
    }
  } catch (error) {
    console.error("\nMongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
