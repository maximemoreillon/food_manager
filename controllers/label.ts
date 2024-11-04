import { Request, Response } from "express"
import createHttpError from "http-errors"
import { openAiClient } from "../openai"

export const parseFoodLabel = async (req: Request, res: Response) => {
  if (!openAiClient) throw createHttpError(400, `OpenAI is not enabled`)
  const file: any = req.file

  const base64Image = file.buffer.toString("base64")

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
  })

  const resonse = completion.choices[0].message.content
  if (!resonse) throw createHttpError(400, "Parsing failed")
  const data = JSON.parse(resonse)

  res.send(data)
}
