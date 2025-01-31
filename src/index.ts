import express, { Request, Response, Application } from "express";
import { pool } from "./db";
import { matchUserUUID } from "./utils";
import { v4 as uuidv4 } from 'uuid';
// import { config } from 'dotenv';
import { z } from 'zod';


const app: Application = express();

app.use(express.json());

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});


//zod schema
const userSchema = z.object({
  user_id: z.string().uuid().default(uuidv4()),
  name: z.string(),
  age: z.number().min(0).max(200)

});

interface Post {
  post_id: string;
  title: string;
  content: number | null;
  user_id: string;
}

//create a user
app.post("/users", async (req: Request, res: Response) => {
  try {

    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
    }

    await pool.query(
      "INSERT INTO users (user_id, name, age) VALUES ($1, $2, $3)",
      [result.data.user_id, result.data.name, result.data.age]
    );

    res.json({
      message: "New user added!",
    data: result.data,
  });

  } catch (err: any) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//get all users
app.get("/users", async (req, res) => {
  try {

    const allUsers: any = await pool.query("SELECT * FROM users");

    if (!allUsers.rows.length) {
      res.status(404).send("No users found")
    };

    // const userNames: string[] = allUsers.rows.map((row: userSchema) => row.name);

    // res.json(userNames);

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//get a user
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send("Bad request")
    };

    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    res.json(user.rows[0].name);

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//update a user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    if (!id || !name || !age) {
      res.status(400).send("Bad request")
    };

    await pool.query(
      "UPDATE users SET name = $1, age = $2 WHERE user_id = $3",
      [name, age, id]
    );

    res.json("Users was updated");

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//delete a user
app.delete("/users/:id", async (req, res) => {
  try {

    const { id } = req.params;
    if (!id) {
      res.status(400).send("Bad request")
    };

    await pool.query(
      "DELETE FROM users WHERE user_id = $1",
      [id]
    );

    res.json("User was successfully deleted");

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//create a post
app.post("/users/:id/posts", async (req: Request, res: Response) => {
  try {

    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).send("Bad request")
    }
    const { path } = req;

    // Regular expression to match user UUID
    const user_id = matchUserUUID(path);

    await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3)",
      [title, content, user_id]
    );

    res.json("Post added!");

  } catch (err: any) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//get all posts
app.get("/users/:id/posts", async (req, res) => {
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
});

//get a post
app.get("/users/:id/posts/:id", async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      res.status(400).send("Bad request")
    };

    // Regular expression to match user UUID
    const { path } = req;
    const user_id = matchUserUUID(path);

    const post = await pool.query(
      "SELECT * FROM posts WHERE user_id = $1 AND id = $2 ",
      [id, user_id]
    );

    res.json(post);

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//update a post
app.put("/users/:id/posts/:id", async (req, res) => {
  try {

    const { id } = req.params;
    const { title, content } = req.body;

    if (!id || !title || !content) {
      res.status(400).send("Bad request")
    };

    const { path } = req;
    const user_id = matchUserUUID(path);

    await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4",
      [title, content, id, user_id]
    );

    res.json("Posts was updated");

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});

//delete a post
app.delete("/users/:id/posts/:id", async (req, res) => {
  try {

    const { id } = req.params;
    if (!id) {
      res.status(400).send("Bad request")
    };

    const { path } = req;
    const user_id = matchUserUUID(path);

    await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    res.json("Post was successfully deleted");

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
});
