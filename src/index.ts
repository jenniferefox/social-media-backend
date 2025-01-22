import express, { Request, Response, Application } from 'express';
import { pool } from './models/user';

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

// TODOS:
//update a user
//delete a user
//get a user


// Questions for Alex:

// Error Message:
// Module '"/Users/jenni/github_repos/social-media-backend/node_modules/.pnpm/@types+express@5.0.0/node_modules/@types/express/index"' can only be default-imported using the 'esModuleInterop' flagts(1259)
// index.d.ts(128, 1): This module is declared with 'export =', and can only be used with a default import when using the 'esModuleInterop' flag.

// So this means that the old export method is used for express and to be able to import I need this flag in my tsconfig file for it to work?
// This might be because I used commonjs, should I use a different one as a default?
