export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  // Note: destructuring results in error
  const _id = getRouterParam(event, "_id");
  const { user_id: _ignored, ...body } = await readBody(event);

  const item = await Food.findOneAndUpdate({ _id, user_id }, body, {
    returnDocument: "after",
  });
  if (!item)
    throw createError({
      statusCode: 400,
      statusMessage: `Food ${_id} not found`,
    });

  return item;
});
