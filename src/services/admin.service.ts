/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from "http-status";
import User from "../models/user.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const loginAdmin = async (request: any) => {
  try {
    //   check if admin exists
    const admin = await User.findOne({
      email: request.email,
      role: {$in: ["super_admin", "sub_admin"]},
    });
    if (!admin) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "User not found",
        response_data: {},
      };
    }

    const isMatch = await bcrypt.compare(request.password, admin.password);

    if (!isMatch) {
      return {
        success: false,
        STATUSCODE: HttpStatus.UNAUTHORIZED,
        message: "Invalid Email or Password",
        response_data: {},
      };
    }

    //   generate JWT token
    const token = jwt.sign(
      {id: admin._id, role: admin.role},
      process.env.JWT_SECRET as string,
      {expiresIn: "1h"}
    );

    return {
      success: true,
      STATUSCODE: HttpStatus.OK,
      message: "Logged In Successfully",
      response_data: admin,
      token,
    };
  } catch (err) {
    console.error("Something went wrong : ", err.message);
    throw new Error(`An unexpected error occured : ${err.message}`);
  }
};

const createUser = async (request: any) => {
  try {
    //   check existing user
    const existingUser = await User.findOne({email: request.email});
    if (existingUser) {
      return {
        success: false,
        STATUSCODE: HttpStatus.CONFLICT,
        message: "Email already exists",
        response_data: {},
      };
    }

    // check if password and confirm password are correct
    if (request.password !== request.confirm_password) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "Passwords do not match",
        response_data: {},
      };
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    const newUser = await User.create({
      name: request.name,
      email: request.email,
      password: hashedPassword,
      role: request.role,
    });

    return {
      success: true,
      STATUSCODE: HttpStatus.CREATED,
      message: "User created successfully",
      response_data: newUser,
    };
  } catch (err) {
    console.error("Something went wrong : ", err.message);
    return {
      success: false,
      STATUSCODE: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occured",
      response_data: {},
    };
  }
};

const getUser = async (request: any) => {
  try {
    const page = parseInt(request.page) || 1; // Current page number (default to 1)
    const limit = parseInt(request.limit) || 10; // Number of results per page (default to 10)
    const skip = (page - 1) * limit; // Calculate how many results to skip

    const {name, email, role} = request;

    const filters: any = {};

    if (name) {
      // Use regex for partial matches (case-insensitive)
      filters.name = {$regex: name, $options: "i"};
    }

    if (email) {
      filters.email = {$regex: email, $options: "i"};
    }

    if (role) {
      filters.role = {$regex: role, $options: "i"}; // Exact match for role
    }

    const get_all_users = await User.find(filters).skip(skip).limit(limit);
    const total_user_count = await User.countDocuments({});

    if (get_all_users.length == 0) {
      return {
        success: false,
        STATUSCODE: HttpStatus.NOT_FOUND,
        message: "no users found",
        total_count: 0,
        page: 1,
        response_data: [],
      };
    }

    return {
      success: true,
      STATUSCODE: HttpStatus.OK,
      message: "users fetched successfully",
      total_count: total_user_count,
      page: request.page,
      response_data: get_all_users,
    };
  } catch (err) {
    console.error("Something went wrong : ", err.message);
    return {
      success: false,
      STATUSCODE: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occured",
      response_data: {},
    };
  }
};

const updateUser = async (request: any) => {
  try {
    request.id = request.id.trim();

    if (!mongoose.Types.ObjectId.isValid(request.id)) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "Invalid user ID",
        response_data: {},
      };
    }
    const userDetails = await User.findOne({_id: request.id});

    if (!userDetails) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "No user with that ID was found",
        response_data: {},
      };
    }

    await User.updateOne(
      {_id: request.id},
      {
        $set: {
          name: request?.name || userDetails.name,
          email: request.email || userDetails.email,
          role: request.role || userDetails.role,
        },
      }
    );
    const updatedUser = await User.findOne({_id: request.id});

    return {
      success: true,
      STATUSCODE: HttpStatus.OK,
      message: "User updated successfully",
      response_data: updatedUser,
    };
  } catch (err) {
    console.error("Something went wrong : ", err.message);
    return {
      success: false,
      STATUSCODE: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occured",
      response_data: {},
    };
  }
};

const deleteUser = async (request: any) => {
  try {
    request.id = request.user_id.trim();
    if (!mongoose.Types.ObjectId.isValid(request.user_id)) {
      return {
        success: false,
        STATUSCODE: HttpStatus.BAD_REQUEST,
        message: "Invalid user ID",
        response_data: {},
      };
    }

    const checkUser = await User.findOne({_id: request.user_id});
    if (!checkUser) {
      return {
        success: false,
        STATUSCODE: HttpStatus.NOT_FOUND,
        message: "No user with that ID was found",
        response_data: {},
      };
    }

    if (checkUser.role == "admin") {
      return {
        success: false,
        STATUSCODE: HttpStatus.FORBIDDEN,
        message: "Admins cannot be deleted",
        response_data: {},
      };
    }

    await User.deleteOne({_id: request.user_id});

    return {
      success: true,
      STATUSCODE: HttpStatus.OK,
      message: "User deleted successfully",
      response_data: {},
    };
  } catch (err) {
    console.error("Something went wrong", err.message);
    return {
      success: false,
      STATUSCODE: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred",
      response_data: {},
    };
  }
};

export default {loginAdmin, createUser, getUser, updateUser, deleteUser};
