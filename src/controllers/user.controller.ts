import HttpStatus from "http-status";
import catchAsync from "../utils/catchAsync.ts";
import userService from "../services/user.service.ts";
import {Request, Response} from "express";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const registered_user = await userService.registerUser(req.body);

  res.status(registered_user.STATUSCODE).send(registered_user);
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const login_user = await userService.loginUser(req.body);

  res.status(login_user.STATUSCODE).send(login_user);
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const get_profile = await userService.getProfile(req.query);

  res.status(get_profile.STATUSCODE).send(get_profile);
});

export default {
  registerUser,
  userLogin,
  getProfile,
};
