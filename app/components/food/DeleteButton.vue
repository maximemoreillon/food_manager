<template>
  <v-btn
    color="#c00000"
    @click="deleteMealPlan()"
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

async function deleteMealPlan() {
  if (!confirm("Delete Food?")) return;
  deleting.value = true;
  try {
    // @ts-ignore
    await $fetch(`/api/foods/${route.params._id}`, { method: "DELETE" });
    navigateTo("/foods");
  } catch (error) {
    notify("Food deletion failed", "error");
  } finally {
    deleting.value = false;
  }
}
</script>
