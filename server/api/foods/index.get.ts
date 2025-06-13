export default defineEventHandler(async (event) => {
  try {
    return await Food.find({});
  } catch (error) {
    return error;
  }
});
