export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  const { user_id: _ignored, ...body } = await readBody(event);

  const item = await UserConfiguration.findOneAndUpdate({ user_id }, body, {
    returnDocument: "after",
    upsert: true,
  });

  return item;
});
