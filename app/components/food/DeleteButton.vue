<template>
  <v-btn
    color="#c00000"
    @click="deleteMealPlan()"
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

async function deleteMealPlan() {
  if (!confirm("Delete Food?")) return;
  deleting.value = true;
  try {
    // @ts-ignore
    await $fetch(`/api/foods/${route.params._id}`, { method: "DELETE" });
    navigateTo("/foods");
  } catch (error) {
    snackbar.value.color = `error`;
    snackbar.value.text = `Food deletion failed`;
    snackbar.value.show = true;
  } finally {
    deleting.value = false;
  }
}
</script>
