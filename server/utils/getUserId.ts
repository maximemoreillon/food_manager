import type { H3Event, EventHandlerRequest } from "h3";

export default async function ({ context }: H3Event<EventHandlerRequest>) {
  const { user } = context;

  if (!user)
    throw createError({ statusCode: 401, statusMessage: "No userInfo" });
  return user.legacy_id || user.sub;
}
