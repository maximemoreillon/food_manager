export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);

  // Note: destructuring results in error
  const _id = getRouterParam(event, "_id");
  const body = await readBody(event);

  const item = await MealPlan.findOneAndUpdate({ _id, user_id }, body, {
    new: true,
  });
  if (!item)
    throw createError({
      statusCode: 400,
      statusMessage: `Meal plan ${_id} not found`,
    });

  return item;
});
