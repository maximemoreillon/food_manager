import { UserConfigurationT } from "~~/server/models/userConfig.schema";

export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  const body = await readBody(event);

  try {
    const userSettings = await UserConfiguration.findOne<UserConfigurationT>({
      user_id,
    });
    return await Log.create({
      date: new Date(),
      user_id,
      calories_target: userSettings?.calories_target || 2500,
      macronutrients_minimum: userSettings?.macronutrients_minimum || {
        protein: 0,
        fat: 0,
        carbohydrates: 0,
      },
      ...body,
    });
  } catch (error) {
    return error;
  }
});
