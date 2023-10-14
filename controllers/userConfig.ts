import { Request, Response } from "express"
import UserConfiguration from "../models/userConfig"

export const read_config = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const config = await UserConfiguration.findOne({ user_id })
  console.log(`Config of user ${user_id} queried`)
  res.send(config)
}

export const update_config = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const options = { upsert: true, new: true }
  const result = await UserConfiguration.findOneAndUpdate(
    { user_id },
    req.body,
    options
  )
  console.log(`Config of user ${user_id} updated`)
  res.send(result)
}
