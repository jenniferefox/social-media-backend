import express from "express";
import {
  createUser,
  checkUserLogIn,
  logoutUser
} from "../controllers/userControllers";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", checkUserLogIn);
router.delete("/logout", logoutUser);

export default router;
