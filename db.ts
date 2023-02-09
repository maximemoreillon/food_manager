import mongoose from "mongoose"
import dotenv from "dotenv"

mongoose.set("strictQuery", true)

dotenv.config()

const { MONGODB_URL = "mongodb://mongo", MONGODB_DB = "food_manager" } =
  process.env

export const connect = () => {
  console.log("[MongoDB] Attempting connection...")
  const connection_url = `${MONGODB_URL}/${MONGODB_DB}`
  mongoose
    .connect(connection_url)
    .then(() => {
      console.log("[Mongoose] Initial connection successful")
    })
    .catch((error) => {
      console.log("[Mongoose] Initial connection failed")
      setTimeout(connect, 5000)
    })
}

export const url = MONGODB_URL
export const db = MONGODB_DB
export const get_state = () => mongoose.connection.readyState
