import express from "express";
import {
  createUser,
  checkUserLogIn,
  logoutUser,
  getUser
} from "../controllers/userControllers";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", checkUserLogIn);
router.delete("/logout", logoutUser);
router.get(`/profile/:id`, getUser);

export default router;
