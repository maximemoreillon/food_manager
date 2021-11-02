const { Schema, model, ObjectId } = require('mongoose')


const foodSchema = new Schema({
  _id: ObjectId,
  quantity: Number,
})

const mealPlanSchema = new Schema({
  name: String,
  date: Date,
  foods: [foodSchema],
 })

 const MealPlan = model('MealPlan', mealPlanSchema)

 module.exports = MealPlan
