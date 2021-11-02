const Food = require('../models/food.js')
const {error_handling} = require('../utils.js')
const sharp = require('sharp')
const path = require('path')
const {uploads_directory} = require('../config.js')

const get_thumbnail_filename = (original_filename) => {
  return original_filename.replace(/(\.[\w\d_-]+)$/i, '_thumbnail$1')
}

const create_image_thumbnail = async (req) => {

  const thumbnail_filename = get_thumbnail_filename(req.file.originalname)
  const thumbnail_path = path.resolve(req.file.destination,thumbnail_filename)

  await sharp(req.file.path, { failOnError: true })
      .resize(128, 128)
      .withMetadata()
      .toFile(thumbnail_path)
}

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



exports.upload_food_image = async (req,res) => {
  try {
    const {_id} = req.params
    const {originalname: image} = req.file
    await create_image_thumbnail(req)
    const result = await Food.findOneAndUpdate({_id}, {image})
    res.send(result)
    console.log(`Image of food${_id} uploaded`)
  } catch (error) {
    error_handling(error,res)
  }
}

exports.read_food_image = async (req,res) => {
  try {
    const {_id} = req.params
    const food = await Food.findOne({_id})
    const image_absolute_path = path.join(__dirname, `../${uploads_directory}`, food.image)
    res.sendFile(image_absolute_path)
  } catch (error) {
    error_handling(error,res)
  }
}

exports.read_food_thumbnail = async (req,res) => {
  try {
    const {_id} = req.params
    const food = await Food.findOne({_id})
    const thumbnail_filename = get_thumbnail_filename(food.image)
    const image_absolute_path = path.join(__dirname, `../${uploads_directory}`, thumbnail_filename)
    res.sendFile(image_absolute_path)
    console.log(`Thumbnail of food ${_id} queried`)
  } catch (error) {
    error_handling(error,res)
  }
}
