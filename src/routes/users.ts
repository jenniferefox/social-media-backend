import express from "express";
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from "../controllers/userControllers";
import { createPost, getAllPosts  } from "../controllers/postControllers";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/posts", createPost);
router.get("/:id/posts", getAllPosts);

export default router;
