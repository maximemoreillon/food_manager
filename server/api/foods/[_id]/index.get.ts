export default defineEventHandler(async (event) => {
  // Note: destructuring results in error
  const _id = event.context.params?._id;

  const food = await Food.findById(_id);
  if (!food)
    throw createError({
      statusCode: 400,
      statusMessage: `Food ${_id} not found`,
    });

  return food;
});
