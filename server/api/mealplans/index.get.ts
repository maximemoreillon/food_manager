export default defineEventHandler(async (event) => {
  const {
    skip = 0,
    limit = 10,
    to,
    from,
    filters = "{}",
    ...rest
  }: any = getQuery(event);

  const formattedFilters = JSON.parse(filters);

  // TODO: user_id
  const query: any = { ...rest, ...formattedFilters };

  try {
    const items = await MealPlan.find(query)
      .skip(Number(skip))
      .sort({ date: -1 })
      .limit(Math.max(Number(limit), 0));

    const total = await MealPlan.countDocuments(query);

    return { total, skip, limit, items };
  } catch (error) {
    return error;
  }
});
