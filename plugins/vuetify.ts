import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "dark",
      themes: {
        light: {
          colors: {
            primary: "#c00000",
          },
        },
        dark: {
          colors: {
            primary: "#c00000",
          },
        },
      },
    },
  });

  app.vueApp.use(vuetify);
});
