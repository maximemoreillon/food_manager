// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
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
    "nuxt-auth-utils",
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      authRequired: !!process.env.NUXT_OAUTH_OIDC_OPENID_CONFIG,
    },
    oauth: {
      oidc: {
        clientId: "",
        clientSecret: "",
        openidConfig: "",
      },
    },
  },
});
