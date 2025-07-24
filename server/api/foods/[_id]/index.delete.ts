import { deleteImageFromS3 } from "~~/server/s3";

export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  // Note: destructuring results in error
  const _id = event.context.params?._id;
  if (!_id)
    throw createError({
      statusCode: 400,
      statusMessage: `Missing food id`,
    });

  const food = await Food.findOneAndDelete({ _id, user_id });
  if (!food)
    throw createError({
      statusCode: 400,
      statusMessage: `Food ${_id} not found`,
    });

  await deleteImageFromS3(_id);
  return food;
});
