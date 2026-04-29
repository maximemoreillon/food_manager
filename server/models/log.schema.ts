import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { foodSchema, FoodT, Macros } from "./food.schema";

export type LogRecord = { food: FoodT; quantity: number };

export type LogT = {
  _id?: string;
  name: string;
  date: Date;
  user_id: string;
  incomplete: boolean;

  foods: LogRecord[];

  calories_target: number;

  // virtuals
  macronutrients: Macros;
  calories: number;
};

const logFoodSchema = new Schema({
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

  foods: [logFoodSchema],

  calories_target: Number,
});

schema.virtual("calories").get(function () {
  const total = this.foods.reduce((acc, { quantity, food }) => {
    if (!food.serving) return acc;
    return acc + quantity * food.serving.calories;
  }, 0);
  return Math.round(total * 100) / 100;
});

schema.virtual("macronutrients").get(function () {
  return this.foods.reduce(
    (acc, { quantity, food }) => {
      if (!food.serving?.macronutrients) return acc;
      const {
        serving: {
          macronutrients: { fat, carbohydrates, protein },
        },
      } = food;
      return {
        carbohydrates: acc.carbohydrates + carbohydrates * quantity,
        fat: acc.fat + fat * quantity,
        protein: acc.protein + protein * quantity,
      };
    },
    { carbohydrates: 0, fat: 0, protein: 0 }
  );
});

export const Log = defineMongooseModel({
  name: "Log",
  schema,
});
