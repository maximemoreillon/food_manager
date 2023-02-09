import dotenv from "dotenv"

dotenv.config()

export const uploads_directory = process.env.UPLOADS_DIRECTORY || "uploads"
