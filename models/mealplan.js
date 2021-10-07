const { Schema, model, ObjectId } = require('mongoose')




const mealPlanSchema = new Schema({
  name: String,
  date: Date,
  foods: [ObjectId],
 })

 const MealPlan = model('MealPlan', mealPlanSchema)

 module.exports = MealPlan
