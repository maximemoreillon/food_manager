import { Schema, model } from "mongoose"

const schema = new Schema({
  calories_target: Number,
  weight: Number,
  user_id: {
    type: String,
    unique: true,
  },
})

const UserConfiguration = model("UserConfiguration", schema)

export default UserConfiguration
