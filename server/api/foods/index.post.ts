import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

export default defineEventHandler(async (event) => {
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  const user_id = userInfo.legacy_id || userInfo.sub;

  const body = await readBody(event);
  const { name } = body;
  return await Food.create({
    user_id,
    name,
  });
});
