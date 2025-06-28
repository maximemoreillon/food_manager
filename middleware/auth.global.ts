export default defineNuxtRouteMiddleware(async (to, from) => {
  // API protection is dealt with using the server middleware
  if (to.path.startsWith("/api")) return;
  const { loggedIn } = useUserSession();
  if (!loggedIn.value && to.path !== "/login") return navigateTo("/login");
});
