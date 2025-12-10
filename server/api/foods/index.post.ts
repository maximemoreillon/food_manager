export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  const body = await readBody(event);

  // TODO: zod validation

  return await Food.create({
    ...body,
    user_id,
  });
});
