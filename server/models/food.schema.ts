import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { z } from "zod";

export type Macros = {
  protein: number;
  fat: number;
  carbohydrates: number;
};

export const macrosInputSchema = z.object({
  protein: z.number().optional(),
  fat: z.number().optional(),
  carbohydrates: z.number().optional(),
});

export const servingInputSchema = z.object({
  size: z.number().optional(),
  unit: z.string().optional(),
  calories: z.number().optional(),
  price: z.number().optional(),
  macronutrients: macrosInputSchema.optional(),
});

export const foodInputSchema = z.object({
  name: z.string().optional(),
  barcode: z.string().optional(),
  hidden: z.boolean().optional(),
  image: z.string().optional(),
  serving: servingInputSchema.optional(),
});

export type FoodT = {
  _id?: string;
  name: string;
  barcode?: string;

  user_id: string;
  hidden: boolean;

  image?: string;

  serving: {
    size: number;
    unit: string;
    calories: number;
    price: number;

    macronutrients: Macros;
  };
};

export const foodSchema = new Schema({
  name: String,

  user_id: String,
  hidden: Boolean,

  image: String, // Name of the image file

  serving: {
    size: { type: Number, default: 0 },
    unit: { type: String, default: "g" },
    calories: { type: Number, default: 0 },
    price: Number,

    macronutrients: {
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
    },
  },
  barcode: String,
});

export const Food = defineMongooseModel({
  name: "Food",
  schema: foodSchema,
});
