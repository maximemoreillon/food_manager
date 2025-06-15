import { sendS3Image } from "~/server/s3";

export default defineEventHandler(async (event) => {
  const _id = event.context.params?._id;
  if (!_id)
    throw createError({ statusCode: 400, statusMessage: "Missing _id" });

  const stream = await sendS3Image(_id);

  return stream;
});
