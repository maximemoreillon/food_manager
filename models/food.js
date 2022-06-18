const { Schema, model } = require('mongoose')


const foodProperties = {

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
  


  // Legacy
  // WARNING: price_per_sering mifght actually be price_per_package
  price_per_serving: Number, // could have been just price
  calories_per_serving: Number, // could have been just calories


  // Should have been nested under "macros"
  protein: Number,
  fat: Number,
  carbohydrates: Number,


  

}

const foodSchema = new Schema(foodProperties)
const Food = model('Food', foodSchema)

exports.foodProperties = foodProperties
exports.foodSchema = foodSchema
exports.Food = Food
