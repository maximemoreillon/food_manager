import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";

export type UserConfigurationT = {
  calories_target: number;
};

const schema = new Schema({
  user_id: {
    type: String,
    unique: true,
  },

  calories_target: Number,
});

export const UserConfiguration = defineMongooseModel({
  name: "userConfiguration",
  schema,
});
