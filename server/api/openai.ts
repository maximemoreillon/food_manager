export default defineEventHandler(async () => {
  const { openaiApiKey } = useRuntimeConfig();
  return { available: !!openaiApiKey };
});
