export default defineEventHandler(async () => ({
  available: !!process.env.OPENAI_API_KEY,
}));
