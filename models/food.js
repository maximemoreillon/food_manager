const { Schema, model } = require('mongoose')


const foodSchema = new Schema({

  name: String,
  user_id: String,
  hidden: Boolean,

  image: String, // Name of the image file

  serving: {
    size: { type: Number, default: 0 },
    unit: { type: String, default: 'g' },
    calories: { type: Number, default: 0 },

    macronutrients: {
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
    },

  },

  // Could try nest those
  // NOTE: Price is not related to serving size
  // IDEA: Have a packaging property
  vendor: String,
  price: Number,

  // WARNING: price_per_serving mifght actually be price_per_package
  price_per_serving: Number, // could have been just price





})
const Food = model('Food', foodSchema)

exports.foodSchema = foodSchema
exports.Food = Food
