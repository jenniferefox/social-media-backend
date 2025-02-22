import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const userSchema = z.object({
  userId: z.string().uuid().default(uuidv4()),
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email"),
  password: z.string().max(200),
  name: z.string().max(100),
  favouriteColour: z.string().max(50),
  favouriteAnimal: z.string().max(50),
  favouriteSnack: z.string().max(50),
});

export const userLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email"),
  password: z.string().max(200),
});
