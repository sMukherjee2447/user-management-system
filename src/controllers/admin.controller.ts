import catchAsync from "../utils/catchAsync.ts";
import adminService from "../services/admin.service.ts";
import {Request, Response} from "express";

const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const login_admin = await adminService.loginAdmin(req.body);

  res.status(login_admin.STATUSCODE).send(login_admin);
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const create_user = await adminService.createUser(req.body);
  res.status(create_user.STATUSCODE).send(create_user);
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const get_user = await adminService.getUser(req.query);
  res.status(get_user.STATUSCODE).send(get_user);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updated_user = await adminService.updateUser(req.body);
  res.status(updated_user.STATUSCODE).send(updated_user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const deleted_user = await adminService.deleteUser(req.query);
  res.status(deleted_user.STATUSCODE).send(deleted_user);
});

export default {
  loginAdmin,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
