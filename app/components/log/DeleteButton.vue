<template>
  <v-btn
    color="#c00000"
    @click="deleteLog()"
    :loading="deleting"
    prepend-icon="mdi-delete"
    text="Delete"
    variant="outlined"
  />

  <v-snackbar :color="snackbar.color" v-model="snackbar.show">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
const route = useRoute();

const deleting = ref(false);
const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

async function deleteLog() {
  if (!confirm("Delete log?")) return;
  deleting.value = true;
  try {
    await $fetch(`/api/logs/${route.params._id}`, { method: "DELETE" });
    navigateTo("/logs");
  } catch (error) {
    snackbar.value.color = `error`;
    snackbar.value.text = `Log deletion failed`;
    snackbar.value.show = true;
  } finally {
    deleting.value = false;
  }
}
</script>
