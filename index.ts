import dotenv from "dotenv"
dotenv.config()
import { author, name as application_name, version } from "./package.json"
console.log(`Food manager API v${version}`)

import express from "express"
import "express-async-errors"
import cors from "cors"
import * as db from "./db"
import food_router from "./routes/foods"
import mealplan_router from "./routes/mealplans"
import user_configuration_router from "./routes/userConfig"
import auth from "@moreillon/express_identification_middleware"
import { uploads_directory } from "./config"
import { Request, Response, NextFunction } from "express"
import promBundle from "express-prom-bundle"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger-output.json"

const { APP_PORT = 80, IDENTIFICATION_URL } = process.env
const promOptions = { includeMethod: true, includePath: true }

db.connect()

// Express configuration
const app = express()
app.use(express.json())
app.use(cors())
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(promBundle(promOptions))

app.get("/", (req, res) => {
  res.send({
    application_name,
    author,
    version,
    mongodb: {
      url: db.redactedConnectionString,
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
app.use("/settings", user_configuration_router)

// Express error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  let { statusCode = 500, message = error } = error
  if (isNaN(statusCode) || statusCode > 600) statusCode = 500
  res.status(statusCode).send(message)
})

// Start server
app.listen(APP_PORT, () => {
  console.log(`[Express] server listening on port ${APP_PORT}`)
})
