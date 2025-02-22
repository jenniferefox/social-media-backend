import { config } from "dotenv";
config();
import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_KEY;

const openai = new OpenAI({"apiKey": OPENAI_KEY});

export async function createUserProfileImage(
  favouriteAnimal: string,
  favouriteColour: string,
  favouriteSnack: string
) {
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: `a cute, ${favouriteColour} ${favouriteAnimal} holding a ${favouriteSnack}`,
    size: "256x256",
    quality: "standard",
    n: 1,
  });

  return response.data[0].url;
};

// (async () => {
//   const result = await createUserProfileImage("dog", "pink", "cinnamon bun");
//   console.log(result);
// })();
