const UserConfiguration = require('../models/user_configuration.js')
const {error_handling} = require('../utils.js')


exports.read_config = async (req,res) => {
  try {
    const user_id = res.locals.user._id
    const config = await UserConfiguration.findOne({user_id})
    console.log(`Config of user ${user_id} queried`)
    res.send(config)
  }
  catch (error) {
    error_handling(error,res)
  }
}


exports.update_config = async (req,res) => {
  try {
    const user_id = res.locals.user._id
    const options = {upsert: true, new: true}
    const result = await UserConfiguration.findOneAndUpdate({user_id}, req.body, options)
    console.log(`Config of user ${user_id} updated`)
    res.send(result)
  }
  catch (error) {
    error_handling(error,res)
  }
}
