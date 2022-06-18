const { Food } = require('./models/food')

exports.migrate = async () => {
    const foods = await Food.find({})

    foods.forEach(food => {

        food.serving = {
            size: 0,
            unit: 'g',
            calories: food.calories_per_serving,
            macronutrients: {
                protein: food.protein,
                fat: food.fat,
                carbohydrates: food.carbohydrates,
            }
        }

        // TODO: remove old properties when done 
        food.save()
    })
}