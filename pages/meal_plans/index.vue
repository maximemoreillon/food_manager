<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title> Meal plans </v-toolbar-title>
      <v-spacer />
      <ClientOnly>
        <MealPlanCreateDialog />
      </ClientOnly>
    </v-toolbar>

    <v-card-text>
      <div v-if="error" class="text-error text-center">Error loading data</div>
      <v-data-table-server
        v-else-if="data"
        :loading="pending"
        :headers="headers"
        :items="data.items"
        :items-length="data.total"
        v-model:sort-by="queryOptions.sortBy"
        v-model:items-per-page="queryOptions.itemsPerPage"
        v-model:page="queryOptions.page"
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
          {{ item.calories || 0 }}/{{ item.calories_target || 0 }}
        </template>

        <template v-slot:item.macronutrients="{ item }">
          <MealPlanCaloriesMacros
            v-if="item.calories_target"
            :target="item.calories_target"
            :calories="item.calories || 0"
            :macronutrients="item.macronutrients"
          />
        </template>

        <template v-slot:item.incomplete="{ item }">
          <v-icon v-if="item.incomplete"> mdi-alert </v-icon>
        </template>
      </v-data-table-server>
      <div v-else class="text-error">No data available</div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { MealPlansResponse } from "~/server/api/mealplans/index.get";
import formatDate from "~/utils/formatDate";

const route = useRoute();
const query = computed(() => route.query); // computed needed to trigger refetch
const { data, pending, error } = await useFetch<MealPlansResponse>(
  `/api/mealplans`,
  { query }
);

const queryOptions = ref({
  page: data.value?.page,
  itemsPerPage: data.value?.itemsPerPage,
  sortBy: [{ key: data.value?.sort, order: data.value?.order }] as SortItem[],
});

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Date", key: "date" },
  { title: "Calories", key: "calories" },
  { title: "Macros", key: "macronutrients" },
  { title: "Incomplete", key: "incomplete", width: "20ch" },
]);

watch(
  queryOptions,
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
