export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  // Note: destructuring results in error
  const _id = getRouterParam(event, "_id");

  const item = await Log.findOne({ _id, user_id });
  if (!item)
    throw createError({
      statusCode: 400,
      statusMessage: `Log ${_id} not found`,
    });

  return item.toObject({ virtuals: true });
});
