const { Schema, model, Types } = require('mongoose')


const mealPlanFoodSchema = new Schema({

  _id: Types.ObjectId, // Should have been food_id or food

  quantity: Number,

  // properties for unregistered foods
  // TODO: Also save those with registered foods
  // TODO: Simply get the same properties as the foodSchema
  // Macros should have been nested
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

  // Should have been nested in 'calories'
  calories_target: Number,
  calories: Number,

  // Should have been nested in 'macros'
  protein: Number,
  fat: Number,
  carbohydrates: Number,

  user_id: String,
  incomplete: Boolean,


 })

 const MealPlan = model('MealPlan', mealPlanSchema)

 module.exports = MealPlan
