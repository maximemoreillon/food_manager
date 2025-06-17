<template>
  <v-dialog max-width="80rem" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" icon="mdi-pencil" variant="flat" />
    </template>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Edit food</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <MealPlanFoodForm
          :mealPlanRecord="mealPlanRecord"
          @submission="handleSubmit"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  mealPlanRecord: { food: FoodT; quantity: number };
}>();

const emit = defineEmits(["edit"]);
const dialog = ref(false);

function handleSubmit(event: { quantity: number; food: FoodT }) {
  dialog.value = false;
  emit("edit", event);
}
</script>
