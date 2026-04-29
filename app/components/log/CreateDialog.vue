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
    <v-card>
      <v-card-title> New log </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="create_log()">
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
                color="primary"
                type="submit"
                :loading="loading"
                prepend-icon="mdi-plus"
                text="Create"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { LogT } from "~~/server/models/log.schema";

const name = ref("");
const loading = ref(false);

async function create_log() {
  loading.value = true;

  const res = await $fetch<LogT>("/api/logs", {
    method: "POST",
    body: { name: name.value },
  });

  const { _id } = res;

  await navigateTo(`/logs/${_id}`);

  loading.value = false;
}
</script>
