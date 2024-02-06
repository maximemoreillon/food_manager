import sharp from "sharp"
import path from "path"
import { mkdirSync, existsSync } from "fs"
import { rimrafSync } from "rimraf"
import { Request, Response } from "express"
import { Food } from "../models/food"
import { UPLOADS_DIRECTORY } from "../config"
import { QueryOptions } from "mongoose"
import createHttpError from "http-errors"

export const read_all_foods = async (req: Request, res: Response) => {
  // TODO: typing
  const {
    skip = "0",
    limit = "0",
    sort = "name",
    order = "1",
    search,
    hidden = false,
  }: any = req.query

  const user_id = res.locals.user?._id
  let query: QueryOptions = { user_id }

  if (search && search !== "") query.name = { $regex: search, $options: "i" }
  if (!hidden)
    query = {
      ...query,
      $or: [{ hidden: { $exists: false } }, { hidden: false }],
    }

  const items = await Food.find(query)
    .sort({ [sort]: order })
    .skip(Number(skip))
    .limit(Math.max(Number(limit), 0))

  const total = await Food.countDocuments(query)

  const response = { total, skip, limit, items }

  res.send(response)
}

export const read_food = async (req: Request, res: Response) => {
  const { _id } = req.params
  const food = await Food.findOne({ _id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)
  res.send(food)
}

export const create_food = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const new_food = await Food.create({ user_id, ...req.body })
  res.send(new_food)
}

export const update_food = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOneAndUpdate({ _id, user_id }, req.body)
  if (!food) throw createHttpError(404, `Food ${_id} not found`)
  res.send(food)
}

export const delete_food = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOneAndDelete({ _id, user_id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)

  const imageFolderPath = path.resolve(UPLOADS_DIRECTORY, _id)
  if (existsSync(imageFolderPath)) rimrafSync(imageFolderPath)

  res.send(food)
}

export const upload_food_image = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const { _id } = req.params
  const { buffer }: any = req.file
  const destFolderPath = path.resolve(UPLOADS_DIRECTORY, _id)
  if (!existsSync(destFolderPath))
    mkdirSync(destFolderPath, { recursive: true })
  const newImageFilename = `image.jpg`
  const newThumbnailFilename = `thumbnail.jpg`
  const newImagePath = path.join(destFolderPath, newImageFilename)
  const newThumbnailPath = path.join(destFolderPath, newThumbnailFilename)
  await sharp(buffer).rotate().toFile(newImagePath)
  await sharp(buffer).rotate().resize(128, 128).toFile(newThumbnailPath)

  // Not needed, now just serves as a flag to specify that the image is set
  const result = await Food.findOneAndUpdate(
    { _id, user_id },
    { image: newImageFilename }
  )
  res.send(result)
}

export const read_food_image = async (req: Request, res: Response) => {
  // NOTE: DB query actually not needed
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOne({ _id, user_id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)

  const image_absolute_path = path.resolve(UPLOADS_DIRECTORY, _id, `image.jpg`)
  res.sendFile(image_absolute_path)
}

export const read_food_thumbnail = async (req: Request, res: Response) => {
  // TODO: just add a ?thumbnaill=yes query param to above
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOne({ _id, user_id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)

  const image_absolute_path = path.resolve(
    UPLOADS_DIRECTORY,
    _id,
    `thumbnail.jpg`
  )

  res.sendFile(image_absolute_path)
}

export const read_food_vendors = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const vendors = await Food.find({ user_id }).distinct("vendor")
  res.send(vendors)
}
