import { Router, Request, Response, NextFunction } from "express"
import multer from "multer"
import {
  create_food,
  read_all_foods,
  read_food,
  update_food,
  delete_food,
  upload_food_image,
  read_food_image,
  read_food_vendors,
} from "../controllers/foods"
import { authMiddleware } from "../auth"

const storage = multer.memoryStorage()
const upload = multer({ storage })

const addVariantToQuery =
  (variant: string) => (req: Request, res: Response, next: NextFunction) => {
    req.query = { ...req.query, variant }
    next()
  }

const router = Router()

// Unprotected routes
router.route("/:_id/image").get(read_food_image)

router
  .route("/:_id/thumbnail")
  .get(addVariantToQuery("thumbnail"), read_food_image)

// Protected routes
router.use(authMiddleware)
router.route("/").get(read_all_foods).post(create_food)
router.route("/vendors").get(read_food_vendors)
router.route("/:_id").get(read_food).patch(update_food).delete(delete_food)
router.route("/:_id/image").post(upload.single("image"), upload_food_image)

export default router
