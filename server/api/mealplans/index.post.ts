export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name } = body;
  try {
    return await MealPlan.create({
      date: new Date(),
      // user_id,
      name,
    });
  } catch (error) {
    return error;
  }
});
