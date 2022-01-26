const {Router} = require('express')
const controller = require('../controllers/foods.js')
const path = require('path')
const multer  = require('multer')
const {uploads_directory} = require('../config.js')

const router = Router()

const storage = multer.diskStorage({
  destination:  (req, file, cb) => { cb(null, uploads_directory) },
  filename:  (req, file, cb) => { cb(null, file.originalname) }
})

const upload = multer({storage})


router.route('/')
  .get(controller.read_all_foods)
  .post(controller.create_food)

router.route('/:_id')
  .get(controller.read_food)
  .patch(controller.update_food)
  .delete(controller.delete_food)

router.route('/:_id/image')
  .get(controller.read_food_image)
  .post(upload.single('image'), controller.upload_food_image)

router.route('/:_id/thumbnail')
  .get(controller.read_food_thumbnail)

module.exports = router
