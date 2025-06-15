export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name } = body;
  return await Food.create({
    // user_id,
    name,
  });
});
