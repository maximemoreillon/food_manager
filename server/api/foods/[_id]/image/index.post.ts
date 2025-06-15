import { storeImageToS3 } from "~/server/s3";

export default defineEventHandler(async (event) => {
  const _id = event.context.params?._id;
  if (!_id)
    throw createError({ statusCode: 400, statusMessage: "Missing _id" });
  const files = await readMultipartFormData(event);
  if (!files)
    throw createError({ statusCode: 400, statusMessage: "Missing file" });

  const [image] = files;

  const fileKey = await storeImageToS3(_id, image.data);

  // TODO: user_id
  return await Food.findOneAndUpdate(
    { _id },
    { image: fileKey },
    { new: true }
  );
});
