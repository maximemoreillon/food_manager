// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  app: {
    head: {
      title: "Food manager",
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "nuxt-mongoose",
    "nuxt-oidc-auth",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  oidc: {
    // Not sure if this is needed
    session: {
      expirationCheck: true,
      automaticRefresh: true,
      expirationThreshold: 3600,
    },
    middleware: {
      globalMiddlewareEnabled: true,
      customLoginPage: false,
    },
    defaultProvider: "auth0",
    providers: {
      auth0: {
        redirectUri: "",
        audience: "",
        baseUrl: "",
        clientId: "",
        clientSecret: "",
        scope: ["openid", "offline_access", "profile", "email"],
        additionalTokenParameters: {
          audience: "",
        },
        additionalAuthParameters: {
          audience: "",
        },
      },
    },
  },
});
