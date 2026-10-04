import OpenAI from "openai";

const { openaiApiKey } = useRuntimeConfig();
export let openAiClient: OpenAI;

if (openaiApiKey) {
  console.log("\x1b[32m✔\x1b[0m OpenAI API key provided");
  openAiClient = new OpenAI();
}
