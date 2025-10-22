<template>
  <v-dialog max-width="50rem">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        prepend-icon="mdi-plus"
        text="Create"
        color="primary"
      />
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title> New Food </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="create_food()">
            <v-row align="center">
              <v-col>
                <v-text-field
                  autofocus
                  label="Name"
                  v-model="name"
                  hide-details
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  prepend-icon="mdi-plus"
                  text="Create"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { FoodT } from "~~/server/models/food.schema";

const loading = ref(false);

const name = ref("");
async function create_food() {
  loading.value = true;

  try {
    const res = await $fetch<FoodT>("/api/foods", {
      method: "POST",
      body: { name: name.value },
    });

    const { _id } = res;
    await navigateTo(`/foods/${_id}`);
  } catch (error) {
    // TODO: snackbar
    console.error(error);
    alert(error);
  } finally {
    loading.value = false;
  }
}
</script>
