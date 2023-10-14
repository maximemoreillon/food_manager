import { Schema, model } from "mongoose"

export const schema = new Schema({

  user_id: String,
  default_calories_target: Number,
})

export default model("userConfiguration", schema)
