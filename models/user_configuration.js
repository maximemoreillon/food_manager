const { Schema, model } = require('mongoose')


 const schema = new Schema({
   calories_target: Number,
   user_id: String,

 })

 const UserConfiguration = model('UserConfiguration', schema)

 module.exports = UserConfiguration
