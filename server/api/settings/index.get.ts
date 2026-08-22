export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  const settings = await UserConfiguration.findOne({ user_id });

  if (settings) return settings;
  else
    return {
      calories_target: 2500,
      macronutrients_minimum: { protein: 0, fat: 0, carbohydrates: 0 },
    };
});
