import { UserConfigurationT } from "~/server/models/userConfig.schema";

export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  const body = await readBody(event);

  try {
    const userSettings = await UserConfiguration.findOne<UserConfigurationT>({
      user_id,
    });
    return await MealPlan.create({
      date: new Date(),
      user_id,
      calories_target: userSettings?.calories_target || 2500,
      ...body,
    });
  } catch (error) {
    return error;
  }
});
