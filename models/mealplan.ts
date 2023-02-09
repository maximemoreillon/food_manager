import { Schema, model } from "mongoose"
import { foodSchema } from "./food"

const mealPlanFoodSchema = new Schema({
  quantity: Number,

  food: foodSchema,
})

const mealPlanSchema = new Schema({
  name: String,
  date: Date,
  user_id: String,
  incomplete: { type: Boolean, default: true },

  foods: [mealPlanFoodSchema],

  macronutrients: {
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
  },

  // Could have been nested in 'calories'
  calories_target: Number,
  calories: Number,
})

const MealPlan = model("MealPlan", mealPlanSchema)

export default MealPlan
