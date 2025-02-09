import express from "express";
import { createUser, getAllUsers, getUser, updateUser, deleteUser } from "../controllers/userControllers";
import { createPost, deletePost, getAllPosts, getPost, updatePost  } from "../controllers/postControllers";

const router = express.Router();

router.post("/login", createUser);
router.get("/users", getAllUsers);
// router.get("/users/:email", checkIfUserValid);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/posts", createPost);
router.get("/users/:id/posts", getAllPosts);
router.get("/users/:id/posts/:id", getPost);
router.put("/users/:id/posts/:id", updatePost);
router.delete("/users/:id/posts/:id", deletePost);

export default router;
