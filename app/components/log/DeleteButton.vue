<template>
  <v-btn
    color="#c00000"
    @click="deleteLog()"
    :loading="deleting"
    prepend-icon="mdi-delete"
    text="Delete"
    variant="outlined"
  />
</template>

<script setup lang="ts">
const route = useRoute();
const { notify } = useSnackbar();

const deleting = ref(false);

async function deleteLog() {
  if (!confirm("Delete log?")) return;
  deleting.value = true;
  try {
    await $fetch(`/api/logs/${route.params._id}`, { method: "DELETE" });
    navigateTo("/logs");
  } catch (error) {
    notify("Log deletion failed", "error");
  } finally {
    deleting.value = false;
  }
}
</script>
