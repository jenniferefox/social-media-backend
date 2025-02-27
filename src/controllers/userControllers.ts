import { Request, Response } from "express";
import { pool } from "../db";
import { userLoginSchema, userSchema } from "../models/users";
import { hashPassword } from "../utils/passwordLogin";
import { compareHashPassword } from "../utils/passwordLogin";
import { deleteCookieOnLogout } from "../utils/passwordLogin";
import { createUserProfileImage, uploadImageToS3 } from "../utils/image";
import {
  createUserService,
  createUserProfileService,
} from "../services/userService";
import { addImageToDB } from "../services/imageService";

export const createUser = async (req: Request, res: Response): Promise<any> => {
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
    const favouriteColour = result.data.favouriteColour;
    const favouriteAnimal = result.data.favouriteAnimal;
    const favouriteSnack = result.data.favouriteSnack;
    const name = result.data.name;
    const hashedPassword = await hashPassword(result.data.password);

    console.log(
      userId,
      email,
      favouriteColour,
      favouriteAnimal,
      favouriteSnack,
      name
    );
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
      return res
        .status(createUserResult.status)
        .json({ error: createUserResult.message });
    }

    const imageUrl = await createUserProfileImage(
      favouriteColour,
      favouriteAnimal,
      favouriteSnack
    );

    const uploadedImage: string | Promise<void> = await uploadImageToS3(
      imageUrl,
      email
    );

    await addImageToDB(uploadedImage, userId);

    return res.status(201).json({
      message: "New user and picture added!",
      userId: userId,
      pictureUrl: uploadedImage
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

export const checkUserLogIn = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = userLoginSchema.safeParse(req.body);
    console.log(result);

    if (!result.success) {
      res.status(400).json({
        error: result.error.errors,
      });
      return;
    }

    const loginDetails = (
      await pool.query("SELECT password, user_id FROM users WHERE email = $1", [
        result.data.email,
      ])
    ).rows[0];
    const dbPassword = loginDetails.password;
    const userId = loginDetails.userId;

    console.log("Comparing", result.data.password, dbPassword);
    (await compareHashPassword(result.data.password, dbPassword))
      ? console.log("Success!")
      : console.log("Fail!");

    return res.status(200).json({
      message: "Login Successful",
      userId: userId,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
    return;
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

export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("Bad request");
    }

    const userDetails = await createUserProfileService(id);

    return res.status(201).json(userDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// NEXT STEPS:
// get route to user id page working
// show corresponding profile pic
// get logout working
// ensure cookies are working
