import OpenAI from "openai";

const { OPENAI_API_KEY } = process.env;
export let openAiClient: OpenAI;

if (OPENAI_API_KEY) {
  console.log("\x1b[32m✔\x1b[0m OpenAI API key provided");
  openAiClient = new OpenAI();
}
