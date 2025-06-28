import { storeImageToS3 } from "~/server/s3";

export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  const _id = event.context.params?._id;
  if (!_id)
    throw createError({ statusCode: 400, statusMessage: "Missing _id" });

  const food = await Food.findOne({ _id, user_id });

  if (!food)
    throw createError({ statusCode: 404, statusMessage: "Food not found" });

  const files = await readMultipartFormData(event);
  if (!files)
    throw createError({ statusCode: 400, statusMessage: "Missing file" });

  const [image] = files;

  const fileKey = await storeImageToS3(_id, image.data);

  // @ts-ignore
  food.image = fileKey;

  await food.save();

  return food.toObject();
});
