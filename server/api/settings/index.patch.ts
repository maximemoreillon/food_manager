export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  const body = await readValidatedBody(event, settingsInputSchema.parse);

  const item = await UserConfiguration.findOneAndUpdate({ user_id }, body, {
    returnDocument: "after",
    upsert: true,
  });

  return item;
});
