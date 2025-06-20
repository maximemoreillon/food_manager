<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="center">
        <v-col>
          <v-toolbar-title> Meal plans </v-toolbar-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <MealPlanCreateDialog />
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-data-table-server
        v-if="data"
        :loading="pending"
        :headers="headers"
        :items="data.items"
        :items-length="data.total"
        v-model:sort-by="tableOptions.sortBy"
        v-model:items-per-page="tableOptions.itemsPerPage"
        v-model:page="tableOptions.page"
      >
        <template v-slot:item.name="{ item }">
          <NuxtLink :href="`/meal_plans/${item._id}`">
            {{ item.name }}
          </NuxtLink>
        </template>

        <template v-slot:item.date="{ item }">
          <span>{{ formatDate(item.date) }}</span>
        </template>

        <template v-slot:item.calories="{ item }">
          {{ item.calories }}/{{ item.calories_target }}
        </template>

        <template v-slot:item.macronutrients="{ item }">
          <MealPlanCaloriesMacros
            :target="item.calories_target"
            :calories="item.calories"
            :macronutrients="item.macronutrients"
          />
        </template>

        <template v-slot:item.incomplete="{ item }">
          <v-icon v-if="item.incomplete"> mdi-alert </v-icon>
        </template>
      </v-data-table-server>
      {{ error }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { MealPlansResponse } from "~/server/api/mealplans/index.get";
import formatDate from "~/utils/formatDate";

const route = useRoute();
const queryParams = computed(() => route.query); // computed needed to trigger refetch
const { data, pending, error } = await useFetch<MealPlansResponse>(
  `/api/mealplans`,
  {
    query: queryParams,
  }
);

const tableOptions = ref({
  page: data.value?.page,
  itemsPerPage: data.value?.itemsPerPage,
  sortBy: [{ key: data.value?.sort, order: data.value?.order }] as SortItem[],
});

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Date", key: "date" },
  { title: "Calories", key: "calories" },
  { title: "Macros", key: "macronutrients" },
  { title: "Incomplete", key: "incomplete" },
]);

watch(
  tableOptions,
  (newVal) => {
    const { page, itemsPerPage, sortBy } = newVal;
    const query: any = {
      ...route.query,
      page: page?.toString(),
      itemsPerPage: itemsPerPage?.toString(),
      sort: sortBy?.at(0)?.key,
      order: sortBy?.at(0)?.order,
    };
    navigateTo({ query: { ...route.query, ...query } });
  },
  { deep: true }
);
</script>
