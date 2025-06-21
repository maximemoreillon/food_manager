<template>
  <v-card :loading="loading" max-width="600px" class="mx-auto">
    <v-toolbar>
      <v-toolbar-title> Settings </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        @click="update_settings()"
        :loading="saving"
        icon="mdi-content-save"
        varian="flat"
      />
    </v-toolbar>
    <v-card-title></v-card-title>

    <v-card-text v-if="!loading && data">
      <v-row>
        <v-col>
          <!-- TODO: stop mutating store data with v-model -->
          <v-text-field
            label="Default calories target"
            v-model="data.calories_target"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="auto"> </v-col>
      </v-row>
    </v-card-text>

    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
</template>
<script setup lang="ts">
import type { UserConfigurationT } from "~/server/models/userConfig.schema";

const saving = ref(false);
const loading = ref(false);

const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

const { data } = useFetch<UserConfigurationT>("/api/settings");

async function update_settings() {
  if (!data.value) return;
  saving.value = true;
  try {
    await $fetch(`/api/settings`, { method: "PATCH", body: data.value });
    snackbar.value.text = `Settings saved`;
    snackbar.value.show = true;
    snackbar.value.color = "success";
  } catch (error) {
    console.error(error);
    snackbar.value.text = `Saving settings failed`;
    snackbar.value.show = true;
    snackbar.value.color = "error";
  } finally {
    saving.value = false;
  }
}
</script>
