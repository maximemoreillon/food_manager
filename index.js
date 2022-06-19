// NPM modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const {author, name: application_name, version} = require('./package.json')
const db = require('./db.js')
const food_router = require('./routes/foods.js')
const mealplan_router = require('./routes/mealplans.js')
const auth = require('@moreillon/express_identification_middleware')
const user_configurations_router = require('./routes/user_configurations.js')
const {uploads_directory} = require('./config.js')

dotenv.config()


const {
  APP_PORT = 80,
  AUTHENTICATION_API_URL
} = process.env

const auth_options = { url: `${AUTHENTICATION_API_URL}/v3/whoami` }



// Express configuration
const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send({
    application_name,
    author,
    version,
    mongodb: {
      url: db.url,
      db: db.db,
      connected: db.get_connected(),
    },
    uploads_directory,
  })
})

app.use('/foods', auth(auth_options), food_router)
app.use('/meal_plans', auth(auth_options), mealplan_router)
app.use('/settings', auth(auth_options), user_configurations_router)

// Express error handling
app.use((error, req, res, next) => {
  console.error(error)
  let { statusCode = 500, message = error } = error
  if(isNaN(statusCode) || statusCode > 600) statusCode = 500
  res.status(statusCode).send(message)
})

// Start server
app.listen(APP_PORT, () => {
  console.log(`[Express] Food manager API v${version} listening on port ${APP_PORT}`);
})


require('./migration').migrate_meal_plans()