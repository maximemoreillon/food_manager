import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";
import { z } from "zod";
import { Macros, macrosInputSchema, nullishNumber } from "./food.schema";

export type UserConfigurationT = {
  calories_target: number;
  macronutrients_minimum: Macros;
};

export const settingsInputSchema = z.object({
  calories_target: nullishNumber,
  macronutrients_minimum: macrosInputSchema.nullish(),
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
