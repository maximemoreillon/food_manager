const {Router} = require('express')
const {
  create_meal_plan,
  read_meal_plans,
  read_meal_plan,
  update_meal_plan,
  delete_meal_plan
} = require('../controllers/mealplans.js')

const router = Router()


router.route('/')
  .get(read_meal_plans)
  .post(create_meal_plan)

router.route('/:_id')
  .get(read_meal_plan)
  .patch(update_meal_plan)
  .delete(delete_meal_plan)



module.exports = router
