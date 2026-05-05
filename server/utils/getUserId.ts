import type { H3Event, EventHandlerRequest } from "h3";

export default async function (event: H3Event<EventHandlerRequest>) {
  const config = useRuntimeConfig();
  if (!config.public.authRequired) return undefined;

  const { user } = await getUserSession(event);

  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  return user?.legacy_id || user?.sub;
}
