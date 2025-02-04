import express from "express";
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from "../controllers/userControllers";
import { createPost, deletePost, getAllPosts, getPost, updatePost  } from "../controllers/postControllers";

const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/posts", createPost);
router.get("/:id/posts", getAllPosts);
router.get("/:id/posts/:id", getPost);
router.put("/:id/posts/:id", updatePost);
router.delete("/:id/posts/:id", deletePost);

export default router;
