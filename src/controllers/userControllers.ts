import { Request, Response } from "express";
import { pool } from "../db";
import { userSchema } from "../models/users";

export const createUser = async (req: Request, res: Response) => {
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

    res.status(201).json({
      message: "New user added!",
      data: result.data.user_id,
  });

  } catch (err: any) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {

    const allUsers: any = await pool.query("SELECT * FROM users");

    const userNames: string[] = allUsers.rows.map((row: { name: string }) => row.name);

    res.json(userNames);

  } catch (err) {

    console.error(err.message);
    res.status(500).json({ error: err.message });

  }
};

export const getUser = async (req: Request, res: Response) => {
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
};


export const updateUser = async (req: Request, res: Response) => {
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
};

//delete a user
export const deleteUser = async (req:Request, res:Response) => {
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
};
