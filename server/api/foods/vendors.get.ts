export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  const vendors = await Food.find({ user_id }).distinct("vendor");
  return vendors;
});
