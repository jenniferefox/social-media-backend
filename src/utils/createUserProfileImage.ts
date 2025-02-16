import OpenAI from "openai";

const openai = new OpenAI();

async function image(
  favourite_animal: string,
  favourite_colour: string,
  favourite_snack: string
) {
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: `a cute, ${favourite_colour} ${favourite_animal} holding a ${favourite_snack}`,
    size: "256x256",
    quality: "standard",
    n: 1,
  });

  return response;
}

(async () => {
  const result = await image("dog", "pink", "cinnamon bun");
  console.log(result.data[0].url);
})();
