import { sendS3Image } from "~~/server/s3";

export default defineEventHandler(async (event) => {
  const searchParams = getQuery(event);
  const { thumbnail } = searchParams;

  const _id = getRouterParam(event, "_id");
  if (!_id)
    throw createError({ statusCode: 400, statusMessage: "Missing _id" });

  const stream = await sendS3Image(_id, !!thumbnail);

  return stream;
});
