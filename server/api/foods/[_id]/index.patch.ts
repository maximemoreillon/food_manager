export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  // TODO: filter by user_id
  // Note: destructuring results in error
  const _id = getRouterParam(event, "_id");
  const body = await readBody(event);

  const item = await Food.findOneAndUpdate({ _id, user_id }, body, {
    new: true,
  });
  if (!item)
    throw createError({
      statusCode: 400,
      statusMessage: `Food ${_id} not found`,
    });

  return item;
});
