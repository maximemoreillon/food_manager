const mongoose = require("mongoose")
const dotenv = require('dotenv')

dotenv.config()

const {
  MONGODB_URL = 'mongodb://mongo',
  MONGODB_DB = 'food_manager'
} = process.env


const mongodb_options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
}


const connect = () => {
  console.log('[MongoDB] Attempting connection...')
  const connection_url = `${MONGODB_URL}/${MONGODB_DB}`
  mongoose.connect(connection_url, mongodb_options)
  .then(() => {console.log('[Mongoose] Initial connection successful')})
  .catch(error => {
    console.log('[Mongoose] Initial connection failed')
    setTimeout(connect,5000)
  })
}



exports.url = MONGODB_URL
exports.db = MONGODB_DB
exports.connect = connect
exports.get_state = () => mongoose.connection.readyState

