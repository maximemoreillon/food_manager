import { Client } from "minio"
import sharp from "sharp"
import { Response } from "express"
import { IMAGE_FILENAME, THUMBNAIL_FILENAME } from "../constants"
import path from "path"

export const {
  S3_REGION,
  S3_ACCESS_KEY_ID = "",
  S3_SECRET_ACCESS_KEY = "",
  S3_ENDPOINT,
  S3_BUCKET,
  S3_PORT = "443",
  S3_USE_SSL,
} = process.env

export let s3Client: Client

if (S3_BUCKET) {
  console.log(`[S3] S3_BUCKET is set, uploading to "${S3_BUCKET}"`)
  s3Client = new Client({
    accessKey: S3_ACCESS_KEY_ID,
    secretKey: S3_SECRET_ACCESS_KEY,
    endPoint: S3_ENDPOINT || "localhost",
    port: Number(S3_PORT),
    useSSL: !!S3_USE_SSL,
  })
} else {
  console.log(`[S3] S3_BUCKET is NOT set, storing uploads locally`)
}

export const storeImageToS3 = async (_id: string, buffer: Buffer) => {
  if (!S3_BUCKET || !s3Client) throw "S3 not configured"

  await s3Client.putObject(
    S3_BUCKET,
    `${_id}/${IMAGE_FILENAME}`,
    await sharp(buffer).rotate().toBuffer()
  )

  await s3Client.putObject(
    S3_BUCKET,
    `${_id}/${THUMBNAIL_FILENAME}`,
    await sharp(buffer).rotate().resize(128, 128).toBuffer()
  )
}

export const deleteImageFromS3 = async (_id: string) => {
  if (!S3_BUCKET || !s3Client) throw "S3 not configured"

  const Prefix = _id.toString()

  const objectsStream = await s3Client.listObjects(S3_BUCKET, Prefix, true)
  const objectsList: any[] = []

  objectsStream.on("data", (obj) => {
    objectsList.push(obj.name)
  })

  objectsStream.on("error", (e) => {
    console.log(e)
  })

  objectsStream.on("end", async () => {
    await s3Client.removeObjects(S3_BUCKET, objectsList)
  })
}

export const sendS3Image = async (
  res: Response,
  _id: string,
  thumbnail: boolean = false
) => {
  if (!S3_BUCKET || !s3Client) throw "S3 not configured"

  const filename = thumbnail ? THUMBNAIL_FILENAME : IMAGE_FILENAME
  const Key = `${_id}/${filename}`
  const { ext } = path.parse(Key)

  const stream = await s3Client.getObject(S3_BUCKET, Key)

  if (!stream) throw "No stream available"

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${encodeURIComponent(filename)}`
  )
  res.setHeader("Content-Type", `image/${ext.replace(".", "")}`)

  stream.on("data", (chunk) => {
    res.write(chunk)
  })
  stream.on("end", () => {
    res.end()
  })
  stream.on("error", (err) => {
    res.end()
  })
}
