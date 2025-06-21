import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";

export type Macros = {
  protein: number;
  fat: number;
  carbohydrates: number;
};

export type FoodT = {
  _id?: string;
  name: string;
  vendor?: string;
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
  vendor: String,
  barcode: String,

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
});

export const Food = defineMongooseModel({
  name: "Food",
  schema: foodSchema,
});
