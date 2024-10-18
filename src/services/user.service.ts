import HttpStatus from "http-status";
import User from "../models/user.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const registerUser = async (request: any) => {
  try {
    //   check if user already exists
    const existingUser = await User.findOne({email: request.email});

    if (existingUser) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "User already exists",
        response_data: {},
      };
    }

    //   check if password and confirm password matches
    if (request.password !== request.confirm_password) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "Password and Confirm Password does not match",
        response_data: {},
      };
    }

    //   hash the password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    //   create new user
    const newUser = await User.create({
      name: request.name,
      email: request.email,
      password: hashedPassword,
    });

    return {
      success: true,
      STATUSCODE: HttpStatus.OK,
      message: "User registered successfully",
      response_data: newUser,
    };
  } catch (err) {
    console.error("Error creating new user : ", err.message);
    throw new Error(
      `An Unexpected Error Occured: ${HttpStatus.INTERNAL_SERVER_ERROR}`
    );
  }
};

const loginUser = async (request: any) => {
  try {
    // Check if the user exists
    const user = await User.findOne({email: request.email});
    if (!user) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "User not found",
        response_data: {},
      };
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(request.password, user.password);
    if (!isMatch) {
      return {
        success: false,
        STATUSCODE: HttpStatus.NOT_ACCEPTABLE,
        message: "Invalid email or password",
        response_data: {},
      };
    }

    // Generate JWT
    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return {
      success: true,
      STATUSCODE: HttpStatus.OK,
      message: "User logged in successfully",
      response_data: user,
      token,
    };
  } catch (err) {
    console.error("Error logging in user : ", err.message);
    throw new Error(
      `An unexpected error occured : ${HttpStatus.INTERNAL_SERVER_ERROR}`
    );
  }
};

const getProfile = async (request: any) => {
  try {
    request.user_id = request.user_id.trim();

    if (!mongoose.Types.ObjectId.isValid(request.user_id)) {
      return {
        success: false,
        STATUSCODE: HttpStatus.NOT_ACCEPTABLE,
        message: "Invalid user_id format",
        response_data: {},
      };
    }

    const user_data = await User.findOne(
      {_id: request.user_id},
      {_id: 1, name: 1, email: 1, createdAt: 1}
    );

    if (!user_data) {
      return {
        success: false,
        STATUSCODE: HttpStatus.NOT_FOUND,
        message: "No User Found",
        response_data: {},
      };
    }

    return {
      success: true,
      STATUSCODE: HttpStatus.OK,
      message: "User Profile",
      response_data: user_data,
    };
  } catch (err) {
    console.error("Error getting user details : ", err.message);
    throw new Error(
      `An Unexpected error occured : ${HttpStatus.INTERNAL_SERVER_ERROR}`
    );
  }
};

export default {
  registerUser,
  loginUser,
  getProfile,
};
