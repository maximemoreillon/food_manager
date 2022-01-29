const MealPlan = require('../models/mealplan.js')
const {error_handling} = require('../utils.js')



exports.read_all = async (req,res) => {
  try {
    const user_id = res.locals.user._id
    const items = await MealPlan.find({user_id})
    res.send(items)
    console.log(`Queried all meal plans`)
  }
  catch (error) {
    error_handling(error,res)
  }
}

exports.read = async (req,res) => {
  try {
    const user_id = res.locals.user._id
    const _id = req.params._id
    const item = await MealPlan.findOne({_id,user_id})
    console.log(`Meal plan ${item._id} queried`)
    res.send(item)
  }
  catch (error) {
    error_handling(error,res)
  }
}

exports.create = async (req,res) => {
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
    error_handling(error,res)
  }
}

exports.update = async (req,res) => {
  try {
    const user_id = res.locals.user._id
    const _id = req.params._id
    const result = await MealPlan.findOneAndUpdate({_id, user_id}, req.body)
    res.send(result)
    console.log(`Meal plan ${_id} updated`)
  }
  catch (error) {
    error_handling(error,res)
  }
}

exports.delete = async (req,res) => {
  try {
    const user_id = res.locals.user._id
    const _id = req.params._id
    const result = await MealPlan.findOneAndDelete({_id, user_id})
    res.send(result)
  }
  catch (error) {
    error_handling(error,res)
  }
}
