import { Client } from "minio";
import sharp from "sharp";

const IMAGE_FILENAME = "image.jpg";
const THUMBNAIL_FILENAME = "thumbnail.jpg";

const {
  s3: { bucket, accessKeyId, secretAccessKey, endpoint, useSsl, port },
} = useRuntimeConfig();

const s3Client = new Client({
  accessKey: accessKeyId,
  secretKey: secretAccessKey,
  endPoint: endpoint,
  port: Number(port),
  useSSL: !!useSsl,
});

export const storeImageToS3 = async (_id: string, buffer: Buffer) => {
  await s3Client.putObject(
    bucket,
    `${_id}/${IMAGE_FILENAME}`,
    await sharp(buffer).rotate().toBuffer(),
  );

  await s3Client.putObject(
    bucket,
    `${_id}/${THUMBNAIL_FILENAME}`,
    await sharp(buffer).rotate().resize(128, 128).toBuffer(),
  );

  // TODO: consider also returning thumbnail key
  return `${_id}/${IMAGE_FILENAME}`;
};

export const deleteImageFromS3 = async (_id: string) => {
  const Prefix = _id.toString();

  const objectsStream = s3Client.listObjects(bucket, Prefix, true);
  const objectsList: any[] = [];

  objectsStream.on("data", (obj) => {
    objectsList.push(obj.name);
  });

  objectsStream.on("error", (e) => {
    console.log(e);
  });

  objectsStream.on("end", async () => {
    await s3Client.removeObjects(bucket, objectsList);
  });
};

export const sendS3Image = async (_id: string, thumbnail: boolean = false) => {
  const filename = thumbnail ? THUMBNAIL_FILENAME : IMAGE_FILENAME;
  const Key = `${_id}/${filename}`;

  const stream = await s3Client.getObject(bucket, Key);

  if (!stream) throw "No stream available";

  return stream;
};
