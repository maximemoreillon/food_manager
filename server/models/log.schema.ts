import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { z } from "zod";
import {
  foodSchema,
  FoodT,
  Macros,
  macrosInputSchema,
  servingInputSchema,
} from "./food.schema";

export type LogRecord = { food: FoodT; quantity: number };

export type LogT = {
  _id?: string;
  name: string;
  date: Date;
  user_id: string;
  incomplete: boolean;

  foods: LogRecord[];

  calories_target: number;
  macronutrients_minimum: Macros;

  // virtuals
  macronutrients: Macros;
  calories: number;
};

const logFoodSchema = new Schema({
  quantity: { type: Number, default: 1 },
  food: { type: foodSchema, required: true },
});

export const logFoodRecordInputSchema = z.object({
  quantity: z.number().optional(),
  food: z.object({
    _id: z.string().optional(),
    name: z.string().optional(),
    barcode: z.string().optional(),
    hidden: z.boolean().optional(),
    image: z.string().optional(),
    serving: servingInputSchema.optional(),
  }),
});

export const logInputSchema = z.object({
  name: z.string().optional(),
  date: z.coerce.date().optional(),
  incomplete: z.boolean().optional(),
  foods: z.array(logFoodRecordInputSchema).optional(),
  calories_target: z.number().optional(),
  macronutrients_minimum: macrosInputSchema.optional(),
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

  macronutrients_minimum: {
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
  },
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
