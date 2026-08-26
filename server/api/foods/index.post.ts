export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  const body = await readValidatedBody(event, foodInputSchema.parse);

  return await Food.create({
    ...body,
    user_id,
  });
});
