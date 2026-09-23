import { validateApiKey } from "../utils/validateApiKey";

// All auth gatekeeping for the API lives here: by the time a route handler
// in server/api/ runs, either event.context.userId is set, or this has
// already thrown 401. Routes just read event.context.userId directly.
export default defineEventHandler(async (event) => {
  // Not an API route: nothing for this middleware to do.
  if (!event.path.startsWith("/api/")) return;

  const config = useRuntimeConfig();
  // Auth disabled (dev/test): leave userId unset. Routes then query without
  // a user_id filter, so this must never be true outside local development.
  if (!config.public.authRequired) return;

  // Raw API key (api-key-manager), distinct from OAuth Bearer tokens — not
  // that this app issues any Bearer tokens itself, but the header choice
  // keeps the two concepts apart on principle.
  const apiKey = getHeader(event, "x-api-key");
  if (apiKey) {
    const userId = await validateApiKey(apiKey);
    if (!userId)
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    event.context.userId = userId;
    return;
  }

  const { user } = await requireUserSession(event);
  event.context.userId = user.sub;
});
