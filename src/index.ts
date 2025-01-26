import express, { Request, Response, Application } from 'express';
import { pool } from './db';

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
  const {id} = req.params
  try {
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
