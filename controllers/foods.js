const Food = require('../models/food.js')
const {error_handling} = require('../utils.js')


exports.read_all_foods = async (req,res) => {
  try {
    const foods = await Food.find({})
    res.send(foods)
    console.log(`Queried all foods`)
  } catch (error) {
    error_handling(error,res)
  }
}

exports.read_food = async (req,res) => {
  try {
    const {_id} = req.params
    const food = await Food.findOne({_id})
    res.send(food)
    console.log(`Food ${food._id} queried`)
  } catch (error) {
    error_handling(error,res)
  }
}

exports.create_food = async (req,res) => {
  try {
    const new_food = new Food(req.body)
    const saved_food = await new_food.save()
    res.send(saved_food)
    console.log(`Food ${saved_food._id} created`)
  } catch (error) {
    error_handling(error,res)
  }
}

exports.update_food = async (req,res) => {
  try {
    const {_id} = req.params
    const result = await Food.findOneAndUpdate({_id}, req.body)
    res.send(result)
  } catch (error) {
    error_handling(error,res)
  }
}
