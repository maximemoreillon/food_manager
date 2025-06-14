export default defineEventHandler(async (event) => {
  try {
    // TODO: _id from query params
    const _id = "a";
    const food = await Food.findOne({ _id });
    // TODO: 404
    if (!food) throw new Error(`Food ${_id} not found`);
    return food;
  } catch (error) {
    return error;
  }
});
