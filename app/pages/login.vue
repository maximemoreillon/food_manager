<template>
  <v-card max-width="20rem" class="mx-auto my-8">
    <v-card-title> Login </v-card-title>
    <v-card-text>
      <template v-if="loggedIn">
        <v-row>
          <v-col> You are currently logged in </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              @click="clear"
              text="logout"
              prepend-icon="mdi-logout"
            />
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row>
          <v-col> You must be authenticated to access this content </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              href="/auth/oidc"
              prepend-icon="mdi-login"
              text="login"
            />
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const { loggedIn, user, session, fetch, clear } = useUserSession();
</script>
