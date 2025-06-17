<template>
  <v-dialog max-width="50rem">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        text="new"
      />
    </template>
    <v-card>
      <v-card-title> New meal plan </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="create_meal_plan()">
          <v-row align="center">
            <v-col>
              <v-text-field autofocus label="Name" v-model="name" />
            </v-col>
            <v-col cols="auto">
              <v-btn color="primary" type="submit" :loading="loading">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const name = ref("");
const loading = ref(false);

async function create_meal_plan() {
  loading.value = true;

  const res = await $fetch("/api/mealplans", {
    method: "POST",
    body: { name: name.value },
  });

  // TODO: typing
  const { _id } = res;

  // TODO: navigate to _id
  await navigateTo(`/meal_plans/${_id}`);

  loading.value = false;
}
</script>
