const { Schema, model } = require('mongoose')


 const foodSchema = new Schema({
   name: String,
   calories_per_serving: Number,
   vendor: String,
   price_per_serving: Number,
   keto_friendly: Boolean,
   protein: Number,
   fat: Number,
   carbohydrates: Number,

 })

 const Food = model('Food', foodSchema)

 module.exports = Food
