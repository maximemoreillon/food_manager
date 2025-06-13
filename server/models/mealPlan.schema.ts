import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { schema as foodSchema } from "./food.schema";

const mealPlanFoodSchema = new Schema({
  quantity: Number,
  food: foodSchema,
});

const schema = new Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now,
  },
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
});

export const MealPlan = defineMongooseModel({
  name: "MealPlan",
  schema,
});
