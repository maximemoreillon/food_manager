const { Schema, model } = require('mongoose')


 const foodSchema = new Schema({
   name: String,

   calories_per_serving: Number, // could have been just calories

   vendor: String,
   price_per_serving: Number, // could have been just price

   keto_friendly: Boolean, // unnnecwessary

   // Should have been nested under "macros"
   protein: Number,
   fat: Number,
   carbohydrates: Number,

   image: String,
   user_id: String,
   hidden: Boolean,

 })

 const Food = model('Food', foodSchema)

 module.exports = Food
