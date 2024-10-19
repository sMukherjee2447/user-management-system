import express from "express";
import {auth, authorizeAdmin} from "../middleware/auth.ts";
import adminController from "../controllers/admin.controller.ts";
const router = express.Router();

router.route("/login").post(adminController.loginAdmin);
router.route("/users").post(auth, authorizeAdmin, adminController.createUser);
router.route("/users").get(auth, authorizeAdmin, adminController.getUser);
router.route("/users").put(auth, authorizeAdmin, adminController.updateUser);
router.route("/users").delete(auth, authorizeAdmin, adminController.deleteUser);

export default router;
