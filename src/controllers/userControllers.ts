import { Request, Response } from "express";
import { pool } from "../db";
import { userLoginSchema, userSchema } from "../models/users";
import { hashPassword } from "../utils/passwordLogin";
import { compareHashPassword } from "../utils/passwordLogin";
import { deleteCookieOnLogout } from "../utils/passwordLogin";
import { createUserProfileImage } from "../utils/image";
import { createUserService } from "../services/userService";

// Question for Alex: Is Promise<any> correct here
// I did this to fix a bug, previously I had Promise<Response>

export const createUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
      return;
    }
    const userId = result.data.userId;
    const email = result.data.email;
    const hashedPassword = await hashPassword(result.data.password);
    const favouriteColour = result.data.favouriteColour;
    const favouriteAnimal = result.data.favouriteAnimal;
    const favouriteSnack = result.data.favouriteSnack;
    const name = result.data.name;

    const createUserResult = await createUserService(
      userId,
      email,
      hashedPassword,
      name,
      favouriteColour,
      favouriteAnimal,
      favouriteSnack,
      Response
    );

    if (createUserResult.error) {
      return res.status(createUserResult.status).json({ error: createUserResult.message })
    }

    const profileURL: string = await createUserProfileImage(
      favouriteColour,
      favouriteAnimal,
      favouriteSnack
    );

    // await pool.query(
    //   "INSERT INTO generatedprofilepic (email, picture_url) VALUES ($1, $2)",
    //   [email, profileURL]
    // );

    return res.status(201).json({
      message: "New user added!",
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const checkUserLogIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = userLoginSchema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
      return;
    }

    // FIXME: Check that email is not null, you are also not checking if db password is not null
    // this is better for readability
    // const queryResponse = await pool.query("SELECT etc.", [result.data.email])
    // const password = queryResponse?rows[0].password

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
    return res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    deleteCookieOnLogout();
    return res.status(200).json({});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};
