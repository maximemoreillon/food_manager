const { Food } = require('./models/food')
const MealPlan = require('./models/mealplan')

exports.migrate_foods = async () => {
    const foods = await Food.find({})

    foods.forEach(food => {

        //

        food.save()
    })
}


exports.migrate_meal_plans = async () => {
    const plans = await MealPlan.find({})

    plans.forEach(plan => {

        //

        plan.save()
    })
}