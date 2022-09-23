const { Schema, model } = require('mongoose')


 const schema = new Schema({
   calories_target: Number,
   weight: Number,
   user_id: {
     type: String,
     unique: true,
   },

 })

 const UserConfiguration = model('UserConfiguration', schema)

 module.exports = UserConfiguration
