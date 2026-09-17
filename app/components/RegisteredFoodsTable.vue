<template>
  <v-data-table-server
    :loading="loading"
    height="50vh"
    :headers="headers"
    :items="foods"
    :items-length="total"
    @click:row="handleRowClicked"
    v-model:sort-by="queryOptions.sortBy"
    v-model:items-per-page="queryOptions.itemsPerPage"
    v-model:page="queryOptions.page"
  >
    <template v-slot:top>
      <v-form @submit.prevent="submitSearch">
        <v-row class="mt-2">
          <v-col>
            <v-text-field v-model="search" clearable label="Search" />
          </v-col>
          <v-col cols="auto">
            <v-btn icon="mdi-magnify" type="submit" variant="plain" />
          </v-col>
        </v-row>
      </v-form>
    </template>

    <template v-slot:item.image="{ item }">
      <v-img width="4em" contain :src="imageSrc(item, true)" />
    </template>

    <template v-slot:item.serving="{ item }">
      {{ item.serving.size }} {{ item.serving.unit }}
    </template>

    <template v-slot:item.serving.calories="{ item }">
      <v-chip
        :color="
          item_too_calorific(item.serving.calories) ? colors.calorie_excess : ''
        "
        outlined
      >
        {{ item.serving.calories }}
      </v-chip>
    </template>

    <template v-slot:item.food.serving="{ item }">
      {{ item.serving.size }} {{ item.serving.unit }}
    </template>

    <template
      v-for="macro in macroKeys"
      v-slot:[`item.serving.macronutrients.${macro}`]="{ item }"
    >
      <v-chip :color="colors[macro]" variant="flat">
        {{ item.serving.macronutrients[macro] }}
      </v-chip>
    </template>
  </v-data-table-server>
</template>

<script lang="ts" setup>
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { FoodsFetchResponse } from "~~/server/api/foods/index.get";
import type { FoodT } from "~~/server/models/food.schema";
import type { LogT } from "~~/server/models/log.schema";

const props = defineProps<{
  open: boolean;
  log: LogT;
}>();

const emit = defineEmits(["foodAdded"]);

const headers = ref([
  { title: "", key: "image" },
  { title: "Name", key: "name" },
  { title: "Serving", key: "serving" },
  { title: "Calories", key: "serving.calories" },
  { title: "Protein", key: "serving.macronutrients.protein" },
  { title: "Fat", key: "serving.macronutrients.fat" },
  { title: "Carbs", key: "serving.macronutrients.carbohydrates" },
]);

const search = ref("");
const debouncedSearch = refDebounced(search, 500);

const queryOptions = ref({
  page: 1,
  itemsPerPage: 50,
  sortBy: [{ key: "name", order: "desc" }] as SortItem[],
});

const query = computed(() => ({
  page: queryOptions.value.page,
  itemsPerPage: queryOptions.value.itemsPerPage,
  sort: queryOptions.value.sortBy?.at(0)?.key,
  order: queryOptions.value.sortBy?.at(0)?.order,
  search: debouncedSearch.value,
}));

const { data, pending: loading } = useFetch<FoodsFetchResponse>(
  "/api/foods",
  { query }
);

const foods = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);

watch(
  () => props.open,
  () => {
    search.value = "";
  }
);

watch(debouncedSearch, () => {
  queryOptions.value.page = 1;
});

function submitSearch() {
  queryOptions.value.page = 1;
}

function item_too_calorific(calorieCount: number) {
  return calorieCount > props.log.calories_target - calorie_total.value;
}

const calorie_total = computed(() => {
  const total = props.log.foods.reduce(
    (acc, { quantity, food }) => acc + quantity * food.serving.calories,
    0
  );
  return Math.round(total * 100) / 100;
});

function handleRowClicked(
  _: any,
  { item }: { item: { quantity: number; food: FoodT } }
) {
  emit("foodAdded", { food: item, quantity: 1 });
}
</script>
