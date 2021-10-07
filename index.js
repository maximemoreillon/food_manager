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

dotenv.config()


const app_port = process.env.APP_PORT ?? 80
const auth_options = { url: `${process.env.AUTHENTICATION_API_URL}/v2/whoami` }



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
  })
})

app.use('/foods', auth(auth_options), food_router)
app.use('/meal_plans', auth(auth_options), mealplan_router)



// Start server
app.listen(app_port, () => {
  console.log(`Food manager API v${version} listening on port ${app_port}`);
})
