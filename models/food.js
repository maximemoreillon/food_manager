const { Schema, model } = require('mongoose')


const foodSchema = new Schema({

  name: String,
  vendor: String,

  user_id: String,
  hidden: Boolean,

  image: String, // Name of the image file

  serving: {
    size: { type: Number, default: 0 },
    unit: { type: String, default: 'g' },
    calories: { type: Number, default: 0 },
    price: Number,

    macronutrients: {
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
    },

  },



})
const Food = model('Food', foodSchema)

exports.foodSchema = foodSchema
exports.Food = Food
