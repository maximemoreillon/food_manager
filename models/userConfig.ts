import { Schema, model } from "mongoose"

export const schema = new Schema({

  user_id: {
    type: String,
    unique: true,
  },

  calories_target: Number,
})

export default model("userConfiguration", schema)
