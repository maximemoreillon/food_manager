export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  return await Food.find({ user_id }).distinct("vendor");
});
