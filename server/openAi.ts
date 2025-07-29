import OpenAI from "openai";

const { OPENAI_API_KEY } = process.env;
export let openAiClient: OpenAI;

if (OPENAI_API_KEY) {
  console.log(`✔ OpenAI API key provided`);
  openAiClient = new OpenAI();
}
