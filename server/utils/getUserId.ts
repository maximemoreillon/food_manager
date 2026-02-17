import type { H3Event, EventHandlerRequest } from "h3";

export default async function (event: H3Event<EventHandlerRequest>) {
  const session = await requireUserSession(event);

  if (!session)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const { user } = session;

  return user.legacy_id || user.sub;
}
