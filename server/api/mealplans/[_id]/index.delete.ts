export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  // Note: destructuring results in error
  const _id = getRouterParam(event, "_id");

  const item = await MealPlan.findOneAndDelete({ _id, user_id });
  if (!item)
    throw createError({
      statusCode: 400,
      statusMessage: `Meal plan ${_id} not found`,
    });

  return item;
});
