import { UUIDTypes } from "uuid";
import { pool } from "../db";
import { userSchema } from "../models/users";

export const createUserService = async (
  userId: string,
  email: string,
  hashedPassword: string,
  name: string,
  favouriteColour: string,
  favouriteAnimal: string,
  favouriteSnack: string,
  res: any
): Promise<any> => {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log(existingUser);
      return res.status(409).json({ message: "User already exists" });
    }
    await pool.query(
      "INSERT INTO users (id, email, password, name, favourite_colour, favourite_animal, favourite_snack) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        userId,
        email,
        hashedPassword,
        name,
        favouriteColour,
        favouriteAnimal,
        favouriteSnack,
      ]
    );
    return { success: true };
  } catch (err: any) {
    console.error(err.message);
    if (err.code === "23505") {
      console.log(err.code);
      return {
        error: true,
        status: 409,
        message: "User already exists. Please sign in.",
      };
    }

    return { error: true, status: 500, message: "Internal server error" };
  }
};

export const createUserProfileService = async (
  userId: UUIDTypes
): Promise<any> => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    const profilePicUrl = await pool.query(
      "SELECT picture_url FROM generatedprofilepic WHERE user_id=$1",
      [userId]
    );

    console.log(profilePicUrl.rows[0])
    return {
      user: user.rows[0],
      id: user.rows[0].id,
      email: user.rows[0].email,
      name: user.rows[0].name,
      favouriteColour: user.rows[0].favourite_colour,
      favouriteAnimal: user.rows[0].favourite_animal,
      favouriteSnack: user.rows[0].favourite_snack,
      pictureUrl: profilePicUrl.rows[0]
    };
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      return {
        error: true,
        status: 409,
        message: "User already exists. Please sign in.",
      };
    }

    return { error: true, status: 500, message: "Internal server error" };
  }
};
