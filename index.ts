// NPM modules
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { author, name as application_name, version } from "./package.json"
import * as db from "./db"
import food_router from "./routes/foods"
import mealplan_router from "./routes/mealplans"
import auth from "@moreillon/express_identification_middleware"
import user_configurations_router from "./routes/user_configurations"
import { uploads_directory } from "./config"
import dotenv from "dotenv"
import { Request, Response, NextFunction } from "express"

dotenv.config()

const { APP_PORT = 80, IDENTIFICATION_URL } = process.env

db.connect()

// Express configuration
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send({
    application_name,
    author,
    version,
    mongodb: {
      url: db.url,
      db: db.db,
      connected: db.get_state(),
    },
    auth: {
      url: IDENTIFICATION_URL,
    },
    uploads_directory,
  })
})

if (IDENTIFICATION_URL) {
  const auth_options = { url: IDENTIFICATION_URL }
  app.use(auth(auth_options))
}

app.use("/foods", food_router)
app.use("/meal_plans", mealplan_router)
app.use("/settings", user_configurations_router)

// Express error handling
// TODO: find type of error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let { statusCode = 500, message = error } = error
  if (isNaN(statusCode) || statusCode > 600) statusCode = 500
  res.status(statusCode).send(message)
})

// Start server
app.listen(APP_PORT, () => {
  console.log(
    `[Express] Food manager API v${version} listening on port ${APP_PORT}`
  )
})
