import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { z } from "zod";
import { Macros, macrosInputSchema } from "./food.schema";

export type UserConfigurationT = {
  calories_target: number;
  macronutrients_minimum: Macros;
};

export const settingsInputSchema = z.object({
  calories_target: z.number().optional(),
  macronutrients_minimum: macrosInputSchema.optional(),
});

const schema = new Schema({
  user_id: {
    type: String,
    unique: true,
  },

  calories_target: Number,

  macronutrients_minimum: {
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
  },
});

export const UserConfiguration = defineMongooseModel({
  name: "userConfiguration",
  schema,
});
