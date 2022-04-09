const MealPlan = require('../models/mealplan.js')



exports.read_all = async (req,res,next) => {
  try {
    const user_id = res.locals.user._id
    const { skip = 0, limit = 10 } = req.query
    const query = {user_id}
    
    const items = await MealPlan
      .find(query)
      .skip(Number(skip))
      .sort({date: -1})
      .limit(Math.max(Number(limit), 0))

    const total = await MealPlan.countDocuments(query)

    const response = { total, skip, limit, items }

    console.log(`Queried meal plans of user ${user_id}`)

    res.send(response)
  }
  catch (error) {
    next(error)
  }
}

exports.read = async (req,res,next) => {
  try {
    const user_id = res.locals.user._id
    const {_id} = req.params
    const item = await MealPlan
      .findOne({_id,user_id})
    console.log(`Meal plan ${_id} queried`)
    res.send(item)
  }
  catch (error) {
    next(error)
  }
}

exports.create = async (req,res,next) => {
  try {
    const user_id = res.locals.user._id
    const new_item = new MealPlan({
      ...req.body,
      date: new Date(),
      user_id,
    })
    const saved_item = await new_item.save()
    res.send(saved_item)
    console.log(`Meal plan ${saved_item._id} created`)
  }
  catch (error) {
    next(error,res)
  }
}

exports.update = async (req,res,next) => {
  try {
    const user_id = res.locals.user._id
    const _id = req.params._id
    const result = await MealPlan.findOneAndUpdate({_id, user_id}, req.body)
    res.send(result)
    console.log(`Meal plan ${_id} updated`)
  }
  catch (error) {
    next(error)
  }
}

exports.delete = async (req,res,next) => {
  try {
    const user_id = res.locals.user._id
    const _id = req.params._id
    const result = await MealPlan.findOneAndDelete({_id, user_id})
    res.send(result)
  }
  catch (error) {
    next(error)
  }
}
