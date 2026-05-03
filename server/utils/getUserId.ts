import type { H3Event, EventHandlerRequest } from "h3";

export default async function (event: H3Event<EventHandlerRequest>) {
  const config = useRuntimeConfig();
  if (!config.public.authRequired) return undefined;

  const session = await requireUserSession(event);

  const { user } = session;

  return user?.legacy_id || user?.sub;
}
