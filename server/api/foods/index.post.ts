export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  const body = await readBody(event);
  const { name } = body;
  return await Food.create({
    user_id,
    name,
  });
});
