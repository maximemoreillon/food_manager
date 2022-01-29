const {Router} = require('express')
const {
  read_config,
  update_config,
} = require('../controllers/user_configurations.js')

const router = Router()


router.route('/')
  .get(read_config)
  .patch(update_config)
  .put(update_config)



module.exports = router
