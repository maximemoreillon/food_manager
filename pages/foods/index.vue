<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Foods</v-toolbar-title>
      <v-spacer />
      <FoodCreateDialog />
    </v-toolbar>

    <v-card-text v-if="data">
      <!-- TODO: ClientOnly might not be needed -->
      <ClientOnly>
        <v-data-table-server
          :loading="pending"
          :headers="headers"
          :items="data.items"
          :items-length="data.total"
          v-model:sort-by="queryOptions.sortBy"
          v-model:items-per-page="queryOptions.itemsPerPage"
          v-model:page="queryOptions.page"
        >
          <template v-slot:top>
            <v-row align="baseline" dense>
              <v-col cols="12" md="6">
                <FoodSearch />
              </v-col>
              <v-spacer />
              <v-col cols="auto">
                <v-checkbox label="Show hidden" v-model="queryOptions.hidden" />
              </v-col>
            </v-row>
          </template>

          <template v-slot:item.name="{ item }">
            <NuxtLink :href="`/foods/${item._id}`">{{ item.name }}</NuxtLink>
          </template>

          <template
            v-for="macro in macroKeys"
            v-slot:[`item.serving.macronutrients.${macro}`]="{ item }"
          >
            <v-chip :color="colors[macro]" variant="flat">
              {{ item.serving.macronutrients[macro] }}
            </v-chip>
          </template>

          <template v-slot:item.serving="{ item }">
            {{ item.serving.size }} {{ item.serving.unit }}
          </template>

          <template v-slot:item.hidden="{ item }">
            <v-icon v-if="item.hidden">mdi-check</v-icon>
          </template>

          <template v-slot:item.image="{ item }">
            <v-img
              width="6em"
              height="6em"
              contain
              :src="imageSrc(item, true)"
            />
          </template>
        </v-data-table-server>
      </ClientOnly>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { FoodsFetchResponse } from "~/server/api/foods/index.get";

const route = useRoute();
const query = computed(() => route.query); // computed needed to trigger refetch
const { data, pending } = await useFetch<FoodsFetchResponse>(`/api/foods`, {
  query,
});

const queryOptions = ref({
  page: data.value?.page,
  itemsPerPage: data.value?.itemsPerPage,
  hidden: data.value?.hidden,
  sortBy: [
    {
      key: data.value?.sort,
      order: data.value?.order,
    },
  ] as SortItem[],
});

watch(
  queryOptions,
  (newVal) => {
    const { page, itemsPerPage, sortBy, hidden } = newVal;
    const query: any = {
      ...route.query,
      page: page?.toString(),
      itemsPerPage: itemsPerPage?.toString(),
      sort: sortBy?.at(0)?.key,
      order: sortBy?.at(0)?.order,
      // TODO: not very nice
      hidden: hidden ? hidden : undefined,
    };
    navigateTo({ query });
  },
  { deep: true }
);

const baseHeaders = ref([
  { title: "Image", key: "image" },
  { title: "Name", key: "name" },
  { title: "Vendor", key: "vendor" },
  { title: "Serving", key: "serving" },
  { title: "Calories [kcal]", key: "serving.calories" },
  {
    title: "Protein [g]",
    key: "serving.macronutrients.protein",
  },
  { title: "Fat [g]", key: "serving.macronutrients.fat" },
  {
    title: "Carbs [g]",
    key: "serving.macronutrients.carbohydrates",
  },
  { title: "Price", key: "serving.price" },
]);

const headers = computed(() => {
  if (query.value.hidden)
    return [...baseHeaders.value, { title: "Hidden", key: "hidden" }];
  else return baseHeaders.value;
});
</script>
