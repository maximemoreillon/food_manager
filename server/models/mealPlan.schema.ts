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
  quantity: { type: Number, default: 1 },
  food: { type: foodSchema, required: true },
});

const schema = new Schema({
  name: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  user_id: String,
  incomplete: { type: Boolean, default: true },

  foods: [mealPlanFoodSchema],

  // TODO: have those as a computed/virtual
  // macronutrients: {
  //   protein: { type: Number, default: 0 },
  //   fat: { type: Number, default: 0 },
  //   carbohydrates: { type: Number, default: 0 },
  // },

  calories_target: Number,
});

schema.virtual("calories").get(function () {
  const total = this.foods.reduce(
    (acc, { quantity, food }) => acc + quantity * food.serving.calories,
    0
  );
  return Math.round(total * 100) / 100;
});

schema.virtual("macronutrients").get(function () {
  return this.foods.reduce(
    (acc, { quantity, food }) => {
      const {
        serving: { macronutrients },
      } = food;
      return {
        carbohydrates:
          acc.carbohydrates + macronutrients.carbohydrates * quantity,
        fat: acc.fat + macronutrients.fat * quantity,
        protein: acc.protein + macronutrients.protein * quantity,
      };
    },
    { carbohydrates: 0, fat: 0, protein: 0 }
  );
});

export const MealPlan = defineMongooseModel({
  name: "MealPlan",
  schema,
});
