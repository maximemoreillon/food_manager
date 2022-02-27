const { Schema, model, ObjectId } = require('mongoose')


const mealPlanFoodSchema = new Schema({
  _id: ObjectId, // Should have been food_id
  quantity: Number,
  // properties for unregistered foods
  name: String,
  calories_per_serving: Number,
  fat: Number,
  carbohydrates: Number,
  protein: Number,
})

const mealPlanSchema = new Schema({
  name: String,
  date: Date,
  foods: [mealPlanFoodSchema],

  calories: Number,
  protein: Number,
  fat: Number,
  carbohydrates: Number,

  user_id: String,
  incomplete: Boolean,


 })

 const MealPlan = model('MealPlan', mealPlanSchema)

 module.exports = MealPlan
