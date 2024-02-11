import { Request, Response } from "express"
import { Food } from "../models/food"
import { QueryOptions } from "mongoose"
import {
  deleteImageFromS3,
  s3Client,
  sendS3Image,
  storeImageToS3,
} from "../imagesStorage/s3"
import {
  storeImageLocally,
  deleteImageLocally,
  sendlocalImage,
} from "../imagesStorage/local"
import { IMAGE_FILENAME } from "../constants"
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

  if (s3Client) await deleteImageFromS3(_id)
  else await deleteImageLocally(_id)

  res.send(food)
}

export const upload_food_image = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const { _id } = req.params
  const { buffer }: any = req.file

  if (s3Client) storeImageToS3(_id, buffer)
  else await storeImageLocally(_id, buffer)

  // Not needed, now just serves as a flag to specify that the image is set
  const result = await Food.findOneAndUpdate(
    { _id, user_id },
    { image: `${_id}/${IMAGE_FILENAME}` }
  )
  res.send(result)
}

export const read_food_image = async (req: Request, res: Response) => {
  // NOTE: DB query actually not needed
  const user_id = res.locals.user?._id
  const { _id } = req.params
  const { variant } = req.query
  const food = await Food.findOne({ _id, user_id })
  if (!food) throw createHttpError(404, `Food ${_id} not found`)

  if (s3Client) await sendS3Image(res, _id, variant === "thumbnail")
  else sendlocalImage(res, _id, variant === "thumbnail")
}

export const read_food_vendors = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const vendors = await Food.find({ user_id }).distinct("vendor")
  res.send(vendors)
}
