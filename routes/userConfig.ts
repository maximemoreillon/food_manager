import { Router } from "express"
import { read_config, update_config } from "../controllers/userConfig"

const router = Router()

router.route("/").get(read_config).patch(update_config).put(update_config)

export default router
