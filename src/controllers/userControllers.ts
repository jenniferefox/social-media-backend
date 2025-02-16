import { Request, Response } from "express";
import { pool } from "../db";
import { userLoginSchema, userSchema } from "../models/users";
import { hashPassword } from "../utils/hashPassword";
import { compareHashPassword } from "../utils/compareHashPassword";
// import { checkIfUserLoggedIn } from "../utils/checkIfUserLoggedIn";
import { deleteCookieOnLogout } from "../utils/deleteCookieOnLogout";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
    }

    const hashedPassword = await hashPassword(result.data.password);
    console.log("Hashed password:", hashedPassword);

    await pool.query(
      "INSERT INTO users (user_id, email, password, name, favourite_colour, favourite_animal, favourite_snack) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        result.data.user_id,
        result.data.email,
        hashedPassword,
        result.data.name,
        result.data.favourite_colour,
        result.data.favourite_animal,
        result.data.favourite_snack,
      ]
    );

    res.status(201).json({
      message: "New user added!",
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const checkUserLogIn = async (req: Request, res: Response) => {
  try {
    const result = userLoginSchema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
    }

    // FIXME: Check that email is not null
    const db_password: string = (
      await pool.query("SELECT password FROM users WHERE email = $1", [
        result.data.email,
      ])
    ).rows[0].password;

    console.log("Comparing", result.data.password, db_password);
    (await compareHashPassword(result.data.password, db_password))
      ? console.log("Success!")
      : console.log("Fail!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("getAllUsers");

    const allUsers: any = await pool.query("SELECT * FROM users");

    const userNames: string[] = allUsers.rows.map(
      (row: { email: string }) => row.email
    );

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
      res.status(400).send("Bad request");
    }

    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    if (!id || !email || !password) {
      res.status(400).send("Bad request");
    }

    await pool.query(
      "UPDATE users SET email = $1, password = $2 WHERE user_id = $3",
      [email, password, id]
    );

    res.json("Users was updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

//delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send("Bad request");
    }

    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);

    res.json("User was successfully deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    deleteCookieOnLogout();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
