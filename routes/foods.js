const {Router} = require('express')
const controller = require('../controllers/foods.js')

const router = Router()


router.route('/')
  .get(controller.read_all_foods)
  .post(controller.create_food)

router.route('/:_id')
  .get(controller.read_food)
  .patch(controller.update_food)



module.exports = router
