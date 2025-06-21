import { UserConfigurationT } from "~/server/models/userConfig.schema";
import getUserId from "~/server/utils/getUserId";

export default defineEventHandler(async (event) => {
  const user_id = await getUserId(event);
  const body = await readBody(event);
  const { name } = body;

  try {
    const userSettings = await UserConfiguration.findOne<UserConfigurationT>({
      user_id,
    });
    return await MealPlan.create({
      date: new Date(),
      user_id,
      name,
      calories_target: userSettings?.calories_target || 2500,
    });
  } catch (error) {
    return error;
  }
});
