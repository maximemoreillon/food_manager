import type { H3Event, EventHandlerRequest } from "h3";

export default async function (event: H3Event<EventHandlerRequest>) {
  const { user }: any = await requireUserSession(event);
  if (!user)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  return user.legacy_id || user.sub;
}
