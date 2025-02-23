import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import OpenAI from "openai";
import { s3 } from "../awsConnection";
import axios from "axios";

config();

export async function createUserProfileImage(
  favouriteColour: string,
  favouriteAnimal: string,
  favouriteSnack: string
): Promise<string> {
  const OPENAI_KEY = process.env.OPENAI_KEY;
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: `a cute, ${favouriteColour} ${favouriteAnimal} holding a ${favouriteSnack}`,
    size: "256x256",
    quality: "standard",
    n: 1,
  });

  const imageUrl = response.data[0].url;
  if (!imageUrl) throw new Error("Failed to retrieve image URL from OpenAI.");

  return imageUrl;
}

// test for createUserProfileImage
// const imageUrl: () => Promise<string> = async () => {
//   const result = await createUserProfileImage("dog", "pink", "cinnamon bun");
//   return result;
// };

// Function to save image in s3 bucket
export async function uploadImageToS3(imageUrl: string, email: string): Promise<string> {
  try {
    const sanitizedEmail =
      email.replace(/@/g, "_at_").replace(/\./g, "_dot_") + ".jpg";
    const s3BucketName = process.env.S3_BUCKET_NAME;

    console.log(`Downloading image from: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    if (response.status !== 200) {
      throw new Error(
        `Failed to download image. Status code: ${response.status}`
      );
    };

    const imageBuffer = Buffer.from(response.data);

    const s3UploadParams = {
      Bucket: s3BucketName,
      Key: sanitizedEmail,
      Body: response.data,
      ContentType: "image/jpeg",
      ContentLength: imageBuffer.length,
    };

    console.log(`Uploading ${sanitizedEmail} to bucket: ${s3BucketName}`);
    await s3.send(new PutObjectCommand(s3UploadParams));

    console.log(`Successfully uploaded: ${sanitizedEmail} profile pic`);

    const s3PicUrl = `https://${s3BucketName}.s3.amazonaws.com/${sanitizedEmail}`;
    return s3PicUrl;

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export function getCurrentProfilePicUrl(email: string) {
  try {
    const sanitizedEmail =
      email.replace(/@/g, "_at_").replace(/\./g, "_dot_") + ".jpg";
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const s3PicUrl = `https://${s3BucketName}.s3.amazonaws.com/${sanitizedEmail}`;
    return s3PicUrl;

  } catch(error) {
    console.error(`Error: ${error.message}`);
  }

}

//  test uploadImage
async function testUpload() {
  try {
    const imageUrl = await createUserProfileImage(
      "pink",
      "dog",
      "cinnamon bun"
    );
    console.log("Uploading image to S3...");
    await uploadImageToS3(imageUrl, "jen@email2.com");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testUpload();
