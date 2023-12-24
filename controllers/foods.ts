import sharp from "sharp"
import path from "path"
import { Request, Response } from "express"
import { Food } from "../models/food"
import { uploads_directory } from "../config"
import { QueryOptions } from "mongoose"
import createHttpError from "http-errors"

const get_thumbnail_filename = (original_filename: string) => {
  return original_filename.replace(/(\.[\w\d_-]+)$/i, "_thumbnail$1")
}

// TODO: find type for req
const create_image_thumbnail = async (req: any) => {
  const thumbnail_filename = get_thumbnail_filename(req.file.originalname)
  const thumbnail_path = path.resolve(req.file.destination, thumbnail_filename)

  await sharp(req.file.path, { failOnError: true })
    .resize(128, 128)
    .withMetadata()
    .toFile(thumbnail_path)
}

export const read_all_foods = async (req: Request, res: Response) => {
  // TODO: typing
  const {
    skip = 0,
    limit = 0,
    sort = "name",
    order = 1,
    search,
    hidden = false,
  } = req.query as any

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
  console.log(`Food ${food._id} queried`)
  res.send(food)
}

export const create_food = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const new_food = await Food.create({ user_id, ...req.body })
  res.send(new_food)
  console.log(`Food ${new_food._id} created`)
}

export const update_food = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOneAndUpdate({ _id, user_id }, req.body)
  if (!food) throw createHttpError(404, `Food ${_id} not found`)
  console.log(`Food ${_id} updated`)
  res.send(food)
}

export const delete_food = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOneAndDelete({ _id, user_id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)
  console.log(`Food ${_id} deleted`)
  res.send(food)
}

export const upload_food_image = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  // TODO: get rid of any
  const { originalname: image } = req.file as any
  await create_image_thumbnail(req)
  const result = await Food.findOneAndUpdate({ _id, user_id }, { image })
  res.send(result)
  console.log(`Image of food${_id} uploaded`)
}

export const read_food_image = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOne({ _id, user_id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)
  if (!food.image) throw createHttpError(404, `Food ${_id} image not found`)

  const image_absolute_path = path.resolve(uploads_directory, food.image)
  res.sendFile(image_absolute_path)
}

export const read_food_thumbnail = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const food = await Food.findOne({ _id, user_id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)
  if (!food.image) throw createHttpError(404, `Food ${_id} image not found`)

  const thumbnail_filename = get_thumbnail_filename(food.image)
  const image_absolute_path = path.resolve(
    uploads_directory,
    thumbnail_filename
  )
  res.sendFile(image_absolute_path)
  console.log(`Thumbnail of food ${_id} queried`)
}

export const read_food_vendors = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const vendors = await Food.find({ user_id }).distinct("vendor")
  res.send(vendors)
}
