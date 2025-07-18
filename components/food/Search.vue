<template>
  <v-form @submit.prevent="submit">
    <v-row align="center" dense>
      <v-col>
        <v-text-field v-model="searchString" hide-details label="Search" />
      </v-col>
      <v-col cols="auto">
        <v-btn type="submit" icon="mdi-magnify" variant="flat" />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts" setup>
const route = useRoute();
const searchString = ref(route.query.search);

function submit() {
  navigateTo({
    query: { ...route.query, search: searchString.value, page: 1 },
  });
}
</script>
