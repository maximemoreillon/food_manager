import { Request, Response } from "express"

import MealPlan from "../models/mealplan"
import { getUserId } from "../auth"

export const create_meal_plan = async (req: Request, res: Response) => {
  const user_id = getUserId(req, res)

  const { _id, ...properties } = req.body

  const new_item = await MealPlan.create({
    date: new Date(),
    user_id,
    ...properties,
  })
  res.send(new_item)
}

export const read_meal_plans = async (req: Request, res: Response) => {
  const user_id = getUserId(req, res)

  const {
    skip = 0,
    limit = 10,
    to,
    from,
    filters = "{}",
    ...rest
  }: any = req.query

  const formattedFilters = JSON.parse(filters)

  const query: any = { user_id, ...rest, ...formattedFilters }

  if (to || from) query.date = {}
  if (to) query.date.$lt = new Date(to)
  if (from) query.date.$gt = new Date(from)

  const items = await MealPlan.find(query)
    .skip(Number(skip))
    .sort({ date: -1 })
    .limit(Math.max(Number(limit), 0))

  const total = await MealPlan.countDocuments(query)

  const response = { total, skip, limit, items }

  res.send(response)
}

export const read_meal_plan = async (req: Request, res: Response) => {
  const user_id = getUserId(req, res)
  const { _id } = req.params
  const item = await MealPlan.findOne({ _id, user_id })
  res.send(item)
}

export const update_meal_plan = async (req: Request, res: Response) => {
  const user_id = getUserId(req, res)
  const { _id } = req.params
  const properties = req.body
  const result = await MealPlan.findOneAndUpdate({ _id, user_id }, properties)
  res.send(result)
}

export const delete_meal_plan = async (req: Request, res: Response) => {
  const user_id = getUserId(req, res)
  const _id = req.params._id
  const result = await MealPlan.findOneAndDelete({ _id, user_id })
  res.send(result)
}
