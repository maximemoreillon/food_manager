import OpenAI from "openai"

const { OPENAI_API_KEY } = process.env
export let openAiClient: OpenAI

if (OPENAI_API_KEY) {
  console.log(`[OpenAI] Key provided, using OpenAI`)
  openAiClient = new OpenAI()
} else {
  console.log(`[OpenAI] Key not provided`)
}
