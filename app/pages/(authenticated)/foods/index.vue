<template>
  <v-row>
    <v-col>
      <h2>Foods</h2>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <FoodCreateDialog />
    </v-col>
  </v-row>

  <v-row align="baseline" dense>
    <v-col cols="12" md="6">
      <FoodSearch :model-value="search" @update:model-value="handleSearch" />
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-checkbox label="Show hidden" v-model="hidden" />
    </v-col>
  </v-row>

  <v-skeleton-loader type="article" v-if="pending" />
  <div v-else-if="error" class="text-error text-center">Error loading data</div>
  <v-data-table-server
    v-else-if="data"
    :loading="pending"
    :headers="headers"
    :items="data.items"
    :items-length="data.total"
    v-model:sort-by="sortBy"
    v-model:items-per-page="itemsPerPage"
    v-model:page="page"
  >
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
      <v-img width="4em" contain :src="imageSrc(item, true)" />
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { FoodsFetchResponse } from "~~/server/api/foods/index.get";

const page = useRouteQuery("page", 1, { transform: Number });
const itemsPerPage = useRouteQuery("itemsPerPage", 10, { transform: Number });
const hidden = useRouteQuery<string, boolean>("hidden", "false", {
  transform: {
    get: (v) => v === "true",
    set: (v) => (v ? "true" : "false"),
  },
});
const search = useRouteQuery<string>("search", "");
const sort = useRouteQuery<string>("sort", "name");
const order = useRouteQuery<"asc" | "desc">("order", "desc");

const route = useRoute();
const query = computed(() => route.query); // computed needed to trigger refetch

const { data, pending, error } = await useFetch<FoodsFetchResponse>(
  "/api/foods",
  { query, key: JSON.stringify(query.value) }
);

const sortBy = computed<SortItem[]>({
  get: () => [{ key: sort.value, order: order.value }],
  set: (value) => {
    sort.value = value?.at(0)?.key ?? "name";
    order.value = (value?.at(0)?.order as "asc" | "desc") ?? "desc";
  },
});

function handleSearch(searchString: string) {
  search.value = searchString;
  page.value = 1;
}

const baseHeaders = ref([
  { title: "Image", key: "image" },
  { title: "Name", key: "name" },
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
  // { title: "Price", key: "serving.price" },
]);

const headers = computed(() => {
  if (hidden.value)
    return [...baseHeaders.value, { title: "Hidden", key: "hidden" }];
  else return baseHeaders.value;
});
</script>
