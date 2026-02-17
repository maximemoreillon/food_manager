export default defineNuxtRouteMiddleware((to, from) => {
  const { path } = to;
  if (path !== "/login" && !path.startsWith("/auth")) {
    const session = useUserSession();
    if (!session.user.value) return navigateTo("/login");
  }
});
