import { Request, Response } from "express"
import UserConfiguration from "../models/userConfig"
import { getUserId } from "../auth"

export const read_config = async (req: Request, res: Response) => {
  const user_id = getUserId(req, res)
  const config = await UserConfiguration.findOne({ user_id })
  res.send(config)
}

export const update_config = async (req: Request, res: Response) => {
  const user_id = getUserId(req, res)
  const options = { upsert: true, new: true }
  const result = await UserConfiguration.findOneAndUpdate(
    { user_id },
    req.body,
    options
  )
  res.send(result)
}
