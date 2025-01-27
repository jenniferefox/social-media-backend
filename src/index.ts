import express, { Request, Response, Application } from 'express';
import { pool } from './db';
import { matchUserUUID } from './utils';

const app: Application = express();

app.use(express.json())

app.listen(5000, () => {
  console.log("server is listening on port 5000");
})

//create a user
app.post("/users", async(req: Request, res: Response) => {
  try {
    const { name, age } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (name, age) VALUES ($1, $2) RETURNING *",
      [name, age]
    );

    res.json(newUser.rows[0])

  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

//get all users
app.get("/users", async(req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");

    res.json(allUsers.rows)

  } catch (err) {
    console.error(err.message);
  }
});

//get a user
app.get("/users/:id", async(req, res) => {
  try {
    const {id} = req.params
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1",
      [id]);

      res.json(user.rows)

  } catch (err) {
    console.error(err.message);
  }});

//update a user
app.put("/users/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    const updateUsers = await pool.query("UPDATE users SET name = $1, age = $2 WHERE user_id = $3",
      [name, age, id]);

      res.json("Users was updated")

  } catch (err) {
    console.error(err.message);
  }
});

//delete a user
app.delete("/users/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1",
      [id]);

      res.json("User was successfully deleted")

  } catch (err) {
    console.error(err.message)
  }
})

//create a post
app.post("/users/:id/posts", async(req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const path = req.path;

    // Regular expression to match user UUID
    const user_id = matchUserUUID(path)
    const newPost = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, user_id]
    );

    res.json(newPost.rows[0])

  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

//get all posts
app.get("/users/:id/posts", async(req, res) => {
  try {
    const path = req.path;

    // Regular expression to match user UUID
    const user_id = matchUserUUID(path)

    const allPosts = await pool.query("SELECT * FROM posts WHERE user_id = $1",
      [user_id]
    );
    res.json(allPosts.rows)

  } catch (err) {
    console.error(err.message);
  }
});

//get a post
app.get("/users/:id/posts/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const path = req.path;

    // Regular expression to match user UUID
    const user_id = matchUserUUID(path)

    const post = await pool.query("SELECT * FROM posts WHERE user_id = $1 AND id = $2 ",
      [id, user_id]
    );
    res.json(post.rows)

  } catch (err) {
    console.error(err.message);
  }});

//update a post
app.put("/users/:id/posts/:id", async(req, res) => {
  try {

    const { id } = req.params;
    const { title, content } = req.body;

    const path = req.path;
    const user_id = matchUserUUID(path)
    const updatePosts = await pool.query("UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4",
      [title, content, id, user_id]
    );
    res.json("Posts was updated")

  } catch (err) {
    console.error(err.message);
  }
});

//delete a post
app.delete("/users/:id/posts/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const path = req.path;
    const user_id = matchUserUUID(path)
    const deletePost = await pool.query("DELETE FROM posts WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );
    res.json("Post was successfully deleted")

  } catch (err) {
    console.error(err.message)
  }
})
