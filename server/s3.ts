import { Client } from "minio";
import sharp from "sharp";
import path from "path";

const IMAGE_FILENAME = "image.jpg";
const THUMBNAIL_FILENAME = "thumbnail.jpg";

const {
  S3_REGION,
  S3_ACCESS_KEY_ID = "",
  S3_SECRET_ACCESS_KEY = "",
  S3_ENDPOINT,
  S3_BUCKET = "food-manager",
  S3_PORT = "443",
  S3_USE_SSL,
} = process.env;

const s3Client = new Client({
  accessKey: S3_ACCESS_KEY_ID,
  secretKey: S3_SECRET_ACCESS_KEY,
  endPoint: S3_ENDPOINT || "localhost",
  port: Number(S3_PORT),
  useSSL: !!S3_USE_SSL,
});

export const storeImageToS3 = async (_id: string, buffer: Buffer) => {
  await s3Client.putObject(
    S3_BUCKET,
    `${_id}/${IMAGE_FILENAME}`,
    await sharp(buffer).rotate().toBuffer()
  );

  await s3Client.putObject(
    S3_BUCKET,
    `${_id}/${THUMBNAIL_FILENAME}`,
    await sharp(buffer).rotate().resize(128, 128).toBuffer()
  );

  // TODO: consider also returning thumbnail key
  return `${_id}/${IMAGE_FILENAME}`;
};

export const deleteImageFromS3 = async (_id: string) => {
  const Prefix = _id.toString();

  const objectsStream = s3Client.listObjects(S3_BUCKET, Prefix, true);
  const objectsList: any[] = [];

  objectsStream.on("data", (obj) => {
    objectsList.push(obj.name);
  });

  objectsStream.on("error", (e) => {
    console.log(e);
  });

  objectsStream.on("end", async () => {
    await s3Client.removeObjects(S3_BUCKET, objectsList);
  });
};

export const sendS3Image = async (_id: string, thumbnail: boolean = false) => {
  const filename = thumbnail ? THUMBNAIL_FILENAME : IMAGE_FILENAME;
  const Key = `${_id}/${filename}`;
  // const { ext } = path.parse(Key);

  const stream = await s3Client.getObject(S3_BUCKET, Key);

  if (!stream) throw "No stream available";

  return stream;
};
