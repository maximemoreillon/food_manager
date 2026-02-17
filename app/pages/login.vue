<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user?.sub }}!</h1>
    <p>Logged in since {{ session?.loggedInAt }}</p>
    <button @click="clear">Logout</button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <a href="/auth/oidc">Login</a>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user, session, fetch, clear } = useUserSession();
</script>
