import { Request, Response } from "express"

import MealPlan from "../models/mealplan"

export const read_meal_plans = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const { skip = 0, limit = 10, ...filters } = req.query
  const query = { user_id, ...filters }

  const items = await MealPlan.find(query)
    .skip(Number(skip))
    .sort({ date: -1 })
    .limit(Math.max(Number(limit), 0))

  const total = await MealPlan.countDocuments(query)

  const response = { total, skip, limit, items }

  res.send(response)
}

export const read_meal_plan = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const { _id } = req.params
  const item = await MealPlan.findOne({ _id, user_id })
  console.log(`Meal plan ${_id} queried`)
  res.send(item)
}

export const create_meal_plan = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const new_item = new MealPlan({
    ...req.body,
    date: new Date(),
    user_id,
  })
  const saved_item = await new_item.save()
  res.send(saved_item)
  console.log(`Meal plan ${saved_item._id} created`)
}

export const update_meal_plan = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const { _id } = req.params
  const properties = req.body
  const result = await MealPlan.findOneAndUpdate({ _id, user_id }, properties)
  res.send(result)
  console.log(`Meal plan ${_id} updated`)
}

export const delete_meal_plan = async (req: Request, res: Response) => {
  const user_id = res.locals.user?._id
  const _id = req.params._id
  const result = await MealPlan.findOneAndDelete({ _id, user_id })
  res.send(result)
}
