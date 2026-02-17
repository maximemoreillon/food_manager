import type { H3Event, EventHandlerRequest } from "h3";

export default async function (event: H3Event<EventHandlerRequest>) {
  const session = await requireUserSession(event);

  if (!session)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const { user } = session;

  return user.sub;

  // const { context } = event
  // const { user } = context;

  // if (!user)
  //   throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  // return user.legacy_id || user.sub;
}
