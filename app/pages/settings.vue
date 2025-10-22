<template>
  <v-skeleton-loader type="article" v-if="loading" />
  <template v-else-if="data">
    <v-row>
      <v-col>
        <h2>Settings</h2>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          @click="update_settings()"
          :loading="saving"
          prepend-icon="mdi-content-save"
          color="primary"
          text="save"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field
          label="Default calories target"
          v-model="data.calories_target"
        />
      </v-col>
    </v-row>
  </template>

  <v-snackbar :color="snackbar.color" v-model="snackbar.show">
    {{ snackbar.text }}
  </v-snackbar>
</template>
<script setup lang="ts">
import type { UserConfigurationT } from "~~/server/models/userConfig.schema";

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
