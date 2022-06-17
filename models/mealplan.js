const { Schema, model, Types } = require('mongoose')

const { foodProperties } = require('./food')

const mealPlanFoodSchema = new Schema({

  
  quantity: Number,
  
  ...foodProperties,

  // if food comes from Food collection, it will have an ID
  _id: Types.ObjectId, // Should have been food_id or food
  
  // LEGACY
  name: String,
  calories_per_serving: Number,
  fat: Number,
  carbohydrates: Number,
  protein: Number,
})

const mealPlanSchema = new Schema({
  name: String,
  date: Date,
  user_id: String,
  incomplete: Boolean,

  foods: [mealPlanFoodSchema],

  // Could have been nested in 'calories'
  calories_target: Number,
  calories: Number,

  // Should have been nested in 'macros'
  protein: Number,
  fat: Number,
  carbohydrates: Number,

  


 })

 const MealPlan = model('MealPlan', mealPlanSchema)

 module.exports = MealPlan
