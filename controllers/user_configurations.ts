import { Request, Response, NextFunction } from "express"
import UserConfiguration from "../models/user_configuration"

export const read_config = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = res.locals.user._id
    const config = await UserConfiguration.findOne({ user_id })
    console.log(`Config of user ${user_id} queried`)
    res.send(config)
  } catch (error) {
    next(error)
  }
}

export const update_config = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = res.locals.user._id
    const options = { upsert: true, new: true }
    const result = await UserConfiguration.findOneAndUpdate(
      { user_id },
      req.body,
      options
    )
    console.log(`Config of user ${user_id} updated`)
    res.send(result)
  } catch (error) {
    next(error)
  }
}
