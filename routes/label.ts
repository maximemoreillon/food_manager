import { Router, Request, Response, NextFunction } from "express"
import multer from "multer"
import { parseFoodLabel } from "../controllers/label"

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = Router()

router.route("/").post(upload.single("image"), parseFoodLabel)

export default router
