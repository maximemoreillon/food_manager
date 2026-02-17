export default defineOAuthOidcEventHandler({
  async onSuccess(event, data) {
    const { user, tokens } = data;
    const sessionData = { user };
    await setUserSession(event, sessionData);
    return sendRedirect(event, "/");
  },

  onError(event, error) {
    console.error("OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
