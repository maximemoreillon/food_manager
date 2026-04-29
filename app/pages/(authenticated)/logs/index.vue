<template>
  <v-row>
    <v-col>
      <h2>Logs</h2>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <LogCreateDialog />
    </v-col>
  </v-row>

  <v-skeleton-loader type="article" v-if="pending" />
  <div v-else-if="error" class="text-error text-center">Error loading data</div>
  <v-data-table-server
    v-else-if="data"
    class="my-4"
    :loading="pending"
    :headers="headers"
    :items="data.items"
    :items-length="data.total"
    v-model:sort-by="queryOptions.sortBy"
    v-model:items-per-page="queryOptions.itemsPerPage"
    v-model:page="queryOptions.page"
  >
    <template v-slot:item.name="{ item }">
      <NuxtLink :href="`/logs/${item._id}`">
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
      <LogCaloriesMacros
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
</template>

<script setup lang="ts">
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { LogsResponse } from "~~/server/api/logs/index.get";
import formatDate from "~/utils/formatDate";

const route = useRoute();
const query = computed(() => route.query); // computed needed to trigger refetch
const { data, pending, error } = await useFetch<LogsResponse>(
  `/api/logs`,
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
    navigateTo({ query });
  },
  { deep: true }
);
</script>
