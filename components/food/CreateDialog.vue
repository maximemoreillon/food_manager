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
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title> New Food </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="create_food()">
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
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
const loading = ref(false);

const name = ref("");
async function create_food() {
  loading.value = true;

  const res = await $fetch("/api/foods", {
    method: "POST",
    body: { name: name.value },
  });

  // TODO: typing
  const { _id } = res;

  // TODO: navigate to _id
  await navigateTo(`/foods/${_id}`);

  loading.value = false;
}
</script>
