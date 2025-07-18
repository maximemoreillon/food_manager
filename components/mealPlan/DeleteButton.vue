<template>
  <v-btn
    color="#c00000"
    @click="deleteMealPlan()"
    :loading="deleting"
    icon="mdi-delete"
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
  if (!confirm("Delete meal plan?")) return;
  deleting.value = true;
  // TODO: error handling
  try {
    await $fetch(`/api/mealplans/${route.params._id}`, { method: "DELETE" });
    navigateTo("/meal_plans");
  } catch (error) {
    snackbar.value.color = `error`;
    snackbar.value.text = `Meal plan deletion failed`;
    snackbar.value.show = true;
  } finally {
    deleting.value = false;
  }
}
</script>
