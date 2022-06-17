const { Schema, model } = require('mongoose')


const foodProperties = {

  name: String,

  image: String, // Name of the image

  serving: {
    size: { type: Number, default: 0 },
    unit: { type: String, default: 'grams' },
    calories: { type: Number, default: 0 }, // New
  },


  vendor: String,
  price: Number,

  // Put in serving?
  macronutrients: {
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrates: { type: Number, default: 0 },
  },


  // Legacy
  price_per_serving: Number, // could have been just price
  calories_per_serving: Number, // could have been just calories


  // Should have been nested under "macros"
  protein: Number,
  fat: Number,
  carbohydrates: Number,


  user_id: String,
  hidden: Boolean,

}

const foodSchema = new Schema(foodProperties)
const Food = model('Food', foodSchema)

exports.foodProperties = foodProperties
exports.foodSchema = foodSchema
exports.Food = Food
