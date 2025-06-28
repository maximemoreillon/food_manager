export default defineEventHandler(async (event) => {
  // Only protect API routes
  if (!event.path.startsWith("/api")) return;

  // Don't protect the session management route used by Nuxt Auth Utils
  if (event.path.startsWith("/auth/_auth/session")) return;

  const { user } = await getUserSession(event);
  if (!user)
    throw createError({
      statusCode: 401,
      statusMessage: "Unauithorized",
    });
});
