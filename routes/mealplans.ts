import { Router } from "express"
import {
  create_meal_plan,
  read_meal_plans,
  read_meal_plan,
  update_meal_plan,
  delete_meal_plan,
} from "../controllers/mealplans"

const router = Router()

router.route("/").get(read_meal_plans).post(create_meal_plan)

router
  .route("/:_id")
  .get(read_meal_plan)
  .patch(update_meal_plan)
  .delete(delete_meal_plan)

export default router
