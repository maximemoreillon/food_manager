export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  // TODO: filter by user_id

  // Note: destructuring results in error
  const _id = event.context.params?._id;

  const food = await Food.findOne({ _id, user_id });
  if (!food)
    throw createError({
      statusCode: 400,
      statusMessage: `Food ${_id} not found`,
    });

  // TODO: consider adding toObject()
  return food;
});
