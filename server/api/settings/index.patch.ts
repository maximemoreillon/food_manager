import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

export default defineEventHandler(async (event) => {
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  const user_id = userInfo.legacy_id || userInfo.sub;
  const body = await readBody(event);

  const item = await UserConfiguration.findOneAndUpdate({ user_id }, body, {
    new: true,
    upsert: true,
  });

  return item;
});
