import { openAiClient } from "../openAi";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);
  if (!files)
    throw createError({ statusCode: 400, statusMessage: "Missing file" });

  const [file] = files;

  if (!openAiClient)
    throw createError({
      statusCode: 400,
      statusMessage: "OpenAI not available",
    });
  if (!file)
    throw createError({ statusCode: 400, statusMessage: "File not provided" });

  const base64Image = file.data.toString("base64");

  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",

        content: [
          {
            type: "text",
            text: `This is a picture of packaged food. 
              The picture should contain nutrition facts about the food. 
              Tell me the portion size if available, how many grams of protein, fats and carbohydrates as well as how many calories are in the food. 
              Format your response as a flat JSON object with the following keys: 
              servingSize for the serving size without unit, servingUnit for the serving unit, calories, protein, fat, carbohydrates
              Apart from servingUnit, the value of all fields should be numbers`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });

  const resonse = completion.choices[0].message.content;
  if (!resonse)
    throw createError({ statusCode: 500, statusMessage: "Parsing failed" });
  const data = JSON.parse(resonse);
  return data;
});
