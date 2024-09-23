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
import {
  uploads_directory,
  APP_PORT,
  IDENTIFICATION_URL,
  OIDC_JWKS_URI,
} from "./config"
import { Request, Response, NextFunction } from "express"
import promBundle from "express-prom-bundle"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger-output.json"
import { s3Client, S3_BUCKET, S3_ENDPOINT, S3_REGION } from "./imagesStorage/s3"
import { authMiddleware } from "./auth"

const promOptions = { includeMethod: true, includePath: true }

db.connect()

// Express configuration
export const app = express()
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
      oidc_jwks_uri: OIDC_JWKS_URI,
    },
    storage: {
      local: !s3Client ? uploads_directory : undefined,
      s3: s3Client
        ? {
            S3_BUCKET,
            S3_ENDPOINT,
            S3_REGION,
          }
        : undefined,
    },
  })
})

app.use(authMiddleware)
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
