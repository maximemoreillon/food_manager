// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
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
        audience: "https://maximemoreillon.com",
        redirectUri: "http://localhost:3000/auth/auth0/callback",
        baseUrl: "",
        clientId: "",
        clientSecret: "",
        scope: ["openid", "offline_access", "profile", "email"],
        additionalTokenParameters: {
          audience: "https://maximemoreillon.com",
        },
        additionalAuthParameters: {
          audience: "https://maximemoreillon.com",
        },
      },
    },
  },
});
