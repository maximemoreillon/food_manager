import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { foodSchema, FoodT, Macros } from "./food.schema";

export type MealPlanRecord = { food: FoodT; quantity: number };

export type MealPlanT = {
  _id?: string;
  name: string;
  date: Date;
  user_id: string;
  incomplete: boolean;

  foods: MealPlanRecord[];

  macronutrients: Macros;

  // Could have been nested in 'calories'
  calories_target: number;
  calories: number;
};

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

  // TODO: have those as a computed/virtual
  macronutrients: {
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
  },

  // Could have been nested in 'calories'
  calories_target: Number,
  // TODO: have this as a computed/virtual
  calories: Number,
});

export const MealPlan = defineMongooseModel({
  name: "MealPlan",
  schema,
});
