import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";

import type { H3Event, EventHandlerRequest } from "h3";

export default async function (event: H3Event<EventHandlerRequest>) {
  const { userInfo } = await getUserSession(event);
  if (!userInfo)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  return userInfo.legacy_id || userInfo.sub;
}
