import { pool } from "../db";
import { generatedProfilePicSchema } from "../models/users";

export async function addImageToDB(pictureUrl: string, userId: string) {
  try {
    const newProfilePic = generatedProfilePicSchema.parse({
      userId: userId,
      pictureUrl: pictureUrl,
    });

    console.log(newProfilePic)

    await pool.query(
      "INSERT INTO generatedprofilepic (picture_id, picture_url, created_at, user_id) VALUES ($1, $2, $3, $4)",
      [
        newProfilePic.pictureId,
        newProfilePic.pictureUrl,
        newProfilePic.createdAt,
        newProfilePic.userId,
      ]
    );
    return { success: true };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { error: true, status: 500, message: "Internal server error" };

  }
}
