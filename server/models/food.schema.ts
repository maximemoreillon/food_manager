import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { z } from "zod";

export type Macros = {
  protein: number;
  fat: number;
  carbohydrates: number;
};

// A cleared v-model.number text field sends "" rather than null/undefined,
// so treat an empty string as "no value" too.
export const nullishNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.number().nullish()
);

export const macrosInputSchema = z.object({
  protein: nullishNumber,
  fat: nullishNumber,
  carbohydrates: nullishNumber,
});

export const servingInputSchema = z.object({
  size: nullishNumber,
  unit: z.string().nullish(),
  calories: nullishNumber,
  price: nullishNumber,
  macronutrients: macrosInputSchema.nullish(),
});

export const foodInputSchema = z.object({
  name: z.string().nullish(),
  barcode: z.string().nullish(),
  hidden: z.boolean().nullish(),
  image: z.string().nullish(),
  serving: servingInputSchema.nullish(),
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
