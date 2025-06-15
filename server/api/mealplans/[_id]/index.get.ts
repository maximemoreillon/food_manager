export default defineEventHandler(async (event) => {
  // Note: destructuring results in error
  const _id = event.context.params?._id;

  const item = await MealPlan.findById(_id);
  if (!item)
    throw createError({
      statusCode: 400,
      statusMessage: `Meal plan ${_id} not found`,
    });

  return item;
});
