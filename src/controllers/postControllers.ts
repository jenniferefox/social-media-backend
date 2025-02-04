import { Request, Response } from "express";
import { pool } from "../db";
import { matchUserUUID } from "../utils";
import { postSchema, Post } from "../models/posts";

export const createPost = async (req: Request, res: Response) => {
  try {

    const result = postSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
    }

    const { path } = req;
    const user_id = matchUserUUID(path);

    await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3)",
      [result.data.title, result.data.content, user_id]
    );

    res.status(201).json({
      message: "New post added!",
      data: result.data.title,
  });

  } catch (err: any) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {

    // Regular expression to match user UUID
    const { path } = req;
    const user_id = matchUserUUID(path);

    const allPosts = await pool.query(
      "SELECT * FROM posts WHERE user_id = $1",
      [user_id]
    );

    if (!allPosts.rows.length) {
      res.status(404).send("No users found")
    };

    const posts: string[] = allPosts.rows.map((row: Post) => row.title);

    res.json(posts);

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
};

// //get a post
// app.get("/users/:id/posts/:id", async (req, res) => {
//   try {

//     const { id } = req.params;

//     if (!id) {
//       res.status(400).send("Bad request")
//     };

//     // Regular expression to match user UUID
//     const { path } = req;
//     const user_id = matchUserUUID(path);

//     const post = await pool.query(
//       "SELECT * FROM posts WHERE user_id = $1 AND id = $2 ",
//       [id, user_id]
//     );

//     res.json(post);

//   } catch (err) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// });

// //update a post
// app.put("/users/:id/posts/:id", async (req, res) => {
//   try {

//     const { id } = req.params;
//     const { title, content } = req.body;

//     if (!id || !title || !content) {
//       res.status(400).send("Bad request")
//     };

//     const { path } = req;
//     const user_id = matchUserUUID(path);

//     await pool.query(
//       "UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4",
//       [title, content, id, user_id]
//     );

//     res.json("Posts was updated");

//   } catch (err) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// });

// //delete a post
// app.delete("/users/:id/posts/:id", async (req, res) => {
//   try {

//     const { id } = req.params;
//     if (!id) {
//       res.status(400).send("Bad request")
//     };

//     const { path } = req;
//     const user_id = matchUserUUID(path);

//     await pool.query(
//       "DELETE FROM posts WHERE id = $1 AND user_id = $2",
//       [id, user_id]
//     );

//     res.json("Post was successfully deleted");

//   } catch (err) {

//     console.error(err.message);
//     res.status(500).json({ error: err.message });

//   }
// });
