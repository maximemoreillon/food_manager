export default defineEventHandler(async (event) => {
  // Note: destructuring results in error
  const _id = event.context.params?._id;
  const body = await readBody(event);

  const item = await Food.findOneAndUpdate({ _id }, body, { new: true });
  if (!item)
    throw createError({
      statusCode: 400,
      statusMessage: `Food ${_id} not found`,
    });

  return item;
});
