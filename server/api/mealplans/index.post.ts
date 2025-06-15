import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

export default defineEventHandler(async (event) => {
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  const user_id = userInfo.legacy_id || userInfo.sub;
  const body = await readBody(event);
  const { name } = body;
  try {
    return await MealPlan.create({
      date: new Date(),
      user_id,
      name,
    });
  } catch (error) {
    return error;
  }
});
