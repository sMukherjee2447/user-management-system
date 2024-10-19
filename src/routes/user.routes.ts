import express from "express";
import {auth} from "../middleware/auth.ts";
const router = express.Router();

import userController from "../controllers/user.controller.ts";

router.route("/register").post(userController.registerUser);

router.route("/login").post(userController.userLogin);

router.route("/profile").get(auth, userController.getProfile);

export default router;
