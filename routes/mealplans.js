const {Router} = require('express')
const controller = require('../controllers/mealplans.js')

const router = Router()


router.route('/')
  .get(controller.read_all)
  .post(controller.create)

router.route('/:_id')
  .get(controller.read)
  .patch(controller.update)
  .delete(controller.delete)



module.exports = router
