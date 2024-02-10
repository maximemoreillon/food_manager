import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3"
import sharp from "sharp"
import { Response } from "express"
import { IMAGE_FILENAME, THUMBNAIL_FILENAME } from "./constants"
import createHttpError from "http-errors"

export const {
  S3_REGION,
  S3_ACCESS_KEY_ID = "",
  S3_SECRET_ACCESS_KEY = "",
  S3_ENDPOINT,
  S3_BUCKET,
} = process.env

export let s3Client: S3Client | undefined

if (S3_BUCKET) {
  console.log(`[S3] S3_BUCKET is set, uploading to "${S3_BUCKET}"`)
  s3Client = new S3Client({
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
    endpoint: S3_ENDPOINT,
  })
} else {
  console.log(`[S3] S3_BUCKET is NOT set, storing uploads locally`)
}

export const storeImageToS3 = async (_id: string, buffer: Buffer) => {
  if (!S3_BUCKET || !s3Client) throw "S3 not configured"

  await s3Client.send(
    new PutObjectCommand({
      Key: `${_id}/${IMAGE_FILENAME}`,
      Bucket: S3_BUCKET,
      Body: await sharp(buffer).rotate().toBuffer(),
    })
  )

  await s3Client.send(
    new PutObjectCommand({
      Key: `${_id}/${THUMBNAIL_FILENAME}`,
      Bucket: S3_BUCKET,
      Body: await sharp(buffer).rotate().resize(128, 128).toBuffer(),
    })
  )
}

export const deleteImageFromS3 = async (_id: string) => {
  if (!S3_BUCKET || !s3Client) throw "S3 not configured"

  const Prefix = _id.toString()

  const objectList = await s3Client.send(
    new ListObjectsCommand({ Bucket: S3_BUCKET, Prefix })
  )

  if (!objectList || !objectList.Contents) throw `${Prefix} has no content`

  for await (const { Key } of objectList.Contents) {
    const options = { Key, Bucket: S3_BUCKET }
    await s3Client.send(new DeleteObjectCommand(options))
  }
}

export const sendS3Image = async (
  res: Response,
  _id: string,
  thumbnail: boolean = false
) => {
  if (!S3_BUCKET || !s3Client) throw "S3 not configured"

  const Key = thumbnail
    ? `${_id}/${THUMBNAIL_FILENAME}`
    : `${_id}/${IMAGE_FILENAME}`

  const options = {
    Bucket: S3_BUCKET,
    Key,
  }

  const response = await s3Client.send(new GetObjectCommand(options))
  if (!response.Body) throw "No Body"
  response.Body.transformToWebStream().pipeTo(
    new WritableStream({
      start() {
        res.setHeader("Content-Disposition", `attachment; filename=${_id}.jpg`)
        res.setHeader("Content-Type", `image/jpg`)
      },
      write(chunk) {
        res.write(chunk)
      },
      close() {
        res.end()
      },
    })
  )
}
