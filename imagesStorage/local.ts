import { mkdirSync, existsSync } from "fs"
import sharp from "sharp"
import path from "path"
import { UPLOADS_DIRECTORY } from "../config"
import { rimrafSync } from "rimraf"
import { Response } from "express"
import { IMAGE_FILENAME, THUMBNAIL_FILENAME } from "../constants"

export const storeImageLocally = async (_id: string, buffer: Buffer) => {
  const destFolderPath = path.resolve(UPLOADS_DIRECTORY, _id)
  if (!existsSync(destFolderPath))
    mkdirSync(destFolderPath, { recursive: true })

  const newImagePath = path.join(destFolderPath, IMAGE_FILENAME)
  const newThumbnailPath = path.join(destFolderPath, THUMBNAIL_FILENAME)
  await sharp(buffer).rotate().toFile(newImagePath)
  await sharp(buffer).rotate().resize(128, 128).toFile(newThumbnailPath)
}

export const deleteImageLocally = async (_id: string) => {
  const imageFolderPath = path.resolve(UPLOADS_DIRECTORY, _id)
  if (existsSync(imageFolderPath)) rimrafSync(imageFolderPath)
}

export const sendlocalImage = (
  res: Response,
  _id: string,
  thumbnail: boolean = false
) => {
  const filename = thumbnail ? THUMBNAIL_FILENAME : IMAGE_FILENAME
  const image_absolute_path = path.resolve(UPLOADS_DIRECTORY, _id, filename)

  res.sendFile(image_absolute_path)
}
