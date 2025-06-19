<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="center">
        <v-col>
          <v-toolbar-title> Meal plans </v-toolbar-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <!-- <v-btn :to="{ name: 'new_meal_plan' }" color="primary">
            <v-icon left>mdi-plus</v-icon>
            <span>New</span>
          </v-btn> -->
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { MealPlanT } from "~/shared/types";
import formatDate from "~/utils/formatDate";

type MealPlansResponse = {
  sort: string;
  order: string;
  page: string;
  itemsPerPage: string;
  items: MealPlanT[];
  total: number;
};

const route = useRoute();
const queryParams = computed(() => route.query); // computed needed to trigger refetch
const { data, pending } = await useFetch<MealPlansResponse>(`/api/mealplans`, {
  query: queryParams,
});

const tableOptions = ref({
  page: Number(route.query.page || data.value?.page),
  itemsPerPage: Number(route.query.itemsPerPage || data.value?.itemsPerPage),
  sortBy: [
    {
      key: route.query.sort || data.value?.sort,
      order: route.query.order || data.value?.order,
    },
  ],
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
      page: page.toString(),
      itemsPerPage: itemsPerPage.toString(),
      sort: sortBy?.at(0)?.key,
      order: sortBy?.at(0)?.order,
    };
    navigateTo({ query: { ...route.query, ...query } });
  },
  { deep: true }
);
</script>
