const { Schema, model, Types } = require('mongoose')

const { foodSchema } = require('./food')

const mealPlanFoodSchema = new Schema({

  
  quantity: Number,
  
  food: foodSchema,
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

  // Could have been nested in 'macronutrients'
  protein: Number,
  fat: Number,
  carbohydrates: Number,

  


 })

 const MealPlan = model('MealPlan', mealPlanSchema)

 module.exports = MealPlan
