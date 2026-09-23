export default defineEventHandler(async (event) => {
  const user_id = event.context.userId;

  const body = await readValidatedBody(event, foodInputSchema.parse);

  return await Food.create({
    ...body,
    user_id,
  });
});
