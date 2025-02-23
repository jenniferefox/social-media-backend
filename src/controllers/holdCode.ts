
// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     console.log("getAllUsers");

//     const allUsers: any = await pool.query("SELECT * FROM users");

//     const userNames: string[] = allUsers.rows.map(
//       (row: { email: string }) => row.email
//     );

//     res.json(userNames);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { email, password } = req.body;

//     if (!id || !email || !password) {
//       res.status(400).send("Bad request");
//     }

//     await pool.query(
//       "UPDATE users SET email = $1, password = $2 WHERE user_id = $3",
//       [email, password, id]
//     );

//     res.json("Users was updated");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// //delete a user
// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       res.status(400).send("Bad request");
//     }

//     await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

//     res.json("User was successfully deleted");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: err.message });
//   }
// };


// Post controllers
// import { Request, Response } from "express";
// import { pool } from "../db";
// import { matchUserUUID } from "../utils/matchUserUUID";
// import { postSchema, Post } from "../models/posts";

// export const createPost = async (req: Request, res: Response) => {
//   try {

//     const result = postSchema.safeParse(req.body);

//     if (!result.success) {
//       res.status(400).json({
//         error: result.error.errors,
//       });
//     }

//     const { path } = req;
//     const userId = matchUserUUID(path);

//     await pool.query(
//       "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3)",
//       [result.data.title, result.data.content, userId]
//     );

//     res.status(201).json({
//       message: "New post added!",
//       data: result.data.title,
//   });

//   } catch (err: any) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// };

// export const getAllPosts = async (req: Request, res: Response) => {
//   try {

//     const { path } = req;
//     const userId = matchUserUUID(path);

//     const allPosts = await pool.query(
//       "SELECT * FROM posts WHERE user_id = $1",
//       [userId]
//     );

//     if (!allPosts.rows.length) {
//       res.status(404).send("No users found")
//     };

//     const posts: string[] = allPosts.rows.map((row: Post) => row.title);

//     res.json(posts);

//   } catch (err) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// };

//  export const getPost = async (req: Request, res: Response) => {
//   try {

//     const { id } = req.params;

//     if (!id) {
//       res.status(400).send("Bad request")
//     };

//     const { path } = req;
//     const userId = matchUserUUID(path);

//     const post = await pool.query(
//       "SELECT * FROM posts WHERE id = $1 AND user_id = $2 ",
//       [id, userId]
//     );

//     res.json(post.rows[0].content);

//   } catch (err) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// };

// //update a post
//  export const updatePost = async (req: Request, res: Response) => {
//   try {

//     const { id } = req.params;
//     const { title, content } = req.body;

//     if (!id || !title || !content) {
//       res.status(400).send("Bad request")
//     };

//     const { path } = req;
//     const userId = matchUserUUID(path);

//     await pool.query(
//       "UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4",
//       [title, content, id, userId]
//     );

//     res.json("Posts was updated");

//   } catch (err) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// };

// //delete a post
//  export const deletePost = async (req: Request, res: Response) => {
//   try {

//     const { id } = req.params;
//     console.log(id);
//     if (!id) {
//       res.status(400).send("Bad request")
//     };

//     const { path } = req;
//     console.log(path)
//     const userId = matchUserUUID(path);

//     await pool.query(
//       "DELETE FROM posts WHERE id = $1",
//       [id]
//     );

//     res.json("Post was successfully deleted");

//   } catch (err) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// };
// posts model
// import { z } from "zod";
// import { v4 as uuidv4 } from "uuid";

// export const postSchema = z.object({
//   postId: z.string().uuid().default(uuidv4()),
//   title: z.string().max(100),
//   content: z.string().max(500),
// });

// export interface Post {
//   postId: string;
//   title: string;
//   content: number | null;
//   user_id: string;
// }

// post routes
// router.post("/users/:id/posts", createPost);
// router.get("/users/:id/posts", getAllPosts);
// router.get("/users/:id/posts/:id", getPost);
// router.put("/users/:id/posts/:id", updatePost);
// router.delete("/users/:id/posts/:id", deletePost);
