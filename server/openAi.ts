import OpenAI from "openai";

export let openAiClient: OpenAI;

const { openaiApiKey } = useRuntimeConfig();
if (openaiApiKey) {
  console.log("\x1b[32m✔\x1b[0m OpenAI API key provided");
  openAiClient = new OpenAI({ apiKey: openaiApiKey });
}
