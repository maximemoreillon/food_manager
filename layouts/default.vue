<script setup lang="ts">
const drawer = ref(false);
</script>

<template>
  <v-app>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <v-app-bar-title>Food manager</v-app-bar-title>
    </v-app-bar>
    <!-- Client only to address hydration mismatch -->
    <client-only>
      <v-navigation-drawer v-model="drawer">
        <!-- <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
        <v-divider></v-divider> -->
        <v-list nav>
          <v-list-item link title="Foods" to="/foods" prepend-icon="mdi-food" />
          <v-list-item
            link
            title="Meal plans"
            to="/meal_plans"
            prepend-icon="mdi-silverware-fork-knife"
          />
          <v-list-item
            link
            title="Settings"
            to="/settings"
            prepend-icon="mdi-cogs"
          />
        </v-list>
      </v-navigation-drawer>
    </client-only>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
