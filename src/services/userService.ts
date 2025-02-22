import { pool } from "../db";
import { userSchema } from "../models/users";

// Question for Alex: How would I use userSchema here?

    export const createUserService = async (
      userId: string,
      email: string,
      hashedPassword: string,
      name: string,
      favouriteColour: string,
      favouriteAnimal: string,
      favouriteSnack: string,
    res: any): Promise<any> => {
        try {

            await pool.query(
              "INSERT INTO users (user_id, email, password, name, favourite_colour, favourite_animal, favourite_snack) VALUES ($1, $2, $3, $4, $5, $6, $7)",
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
          return {success: true};
        } catch(err: any) {
          console.error(err.message);
          if (err.code === "23505") {
            return { error: true, status: 409, message: "User already exists. Please sign in." };
          }

          return { error: true, status: 500, message: "Internal server error" };
        }
    };
