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
      <v-form @submit.prevent="getFoods">
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
      <v-img width="4em" contain :src="imageSrc(item)" />
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
  </v-data-table-server>
</template>

<script lang="ts" setup>
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { FoodsFetchResponse } from "~/server/api/foods/index.get";
import type { FoodT } from "~/server/models/food.schema";
import type { MealPlanT } from "~/server/models/mealPlan.schema";

const props = defineProps<{
  open: boolean;
  meal_plan: MealPlanT;
}>();

const emit = defineEmits(["foodAdded"]);

const headers = ref([
  { title: "", key: "image" },
  { title: "Name", key: "name" },
  { title: "Vendor", key: "vendor" },
  { title: "Serving", key: "serving" },
  { title: "Calories", key: "serving.calories" },
  { title: "Protein", key: "serving.macronutrients.protein" },
  { title: "Fat", key: "serving.macronutrients.fat" },
  { title: "Carbs", key: "serving.macronutrients.carbohydrates" },
]);

const search = ref("");

const loading = ref(false);

const foods = ref<FoodT[]>([]);
const total = ref(0);

const queryOptions = ref({
  page: 1,
  itemsPerPage: 50,
  sortBy: [{ key: "name", order: "desc" }] as SortItem[],
});

async function getFoods() {
  loading.value = true;
  const res = await $fetch<FoodsFetchResponse>("/api/foods", {
    query: {
      page: queryOptions.value.page,
      itemsPerPage: queryOptions.value.itemsPerPage,
      sort: queryOptions.value.sortBy?.at(0)?.key,
      order: queryOptions.value.sortBy?.at(0)?.order,
      search: search.value,
    },
  });

  foods.value = res.items;
  total.value = res.total;
  loading.value = false;
}

onMounted(async () => {
  await getFoods();
});

watch(
  queryOptions,
  () => {
    console.log(queryOptions.value);
    getFoods();
  },
  { deep: true }
);

watch(
  () => props.open,
  () => {
    search.value = "";
  }
);

function item_too_calorific(calorieCount: number) {
  return calorieCount > props.meal_plan.calories_target - calorie_total.value;
}

// TODO: make util
const calorie_total = computed(() => {
  const total = props.meal_plan.foods.reduce(
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
