<script setup>
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
</script>

<template>
  <v-card class="mx-auto" max-width="30em">
    <v-card-title> Login </v-card-title>
    <v-card-text v-if="loggedIn">
      <v-row justify="center">
        <v-col cols="auto"> Logged in as {{ user.email }} </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            @click="clear"
            color="primary"
            text="Logout"
            prepend-icon="mdi-logout"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            href="/auth/auth0"
            color="primary"
            text="Login with Auth0"
            prepend-icon="mdi-login"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
