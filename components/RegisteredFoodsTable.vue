<template>
  <v-data-table
    :loading="loading"
    height="50vh"
    :headers="headers"
    :items="foods"
    :search="search"
    :items-per-page="50"
    @click:row="handleRowClicked"
  >
    <!-- @click:row="$emit('foodAdded', { food: $event, quantity: 1 })" -->

    <template v-slot:top>
      <v-row class="mt-2">
        <v-col>
          <v-text-field
            v-model="search"
            clearable
            append-icon="mdi-magnify"
            label="Search"
          />
        </v-col>
      </v-row>
    </template>

    <template v-slot:item.image="{ item }">
      <v-img width="6em" height="6em" contain :src="imageSrc(item)" />
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

    <!-- <template v-slot:item.add="{ item }">
      <v-btn
        text="add"
        color="primary"
        @click="$emit('foodAdded', { food: item, quantity: 1 })"
      />
    </template> -->
  </v-data-table>
</template>

<script lang="ts" setup>
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
  // { title: "Add", key: "add" },
]);

const search = ref("");

const loading = ref(false);
const foods = ref<FoodT[]>([]);

async function getFoods() {
  loading.value = true;
  // TODO: figure out if $fetch was the right choice
  const res = await $fetch<FoodsFetchResponse>("/api/foods", {
    query: { itemsPerPage: 1000 },
  });

  foods.value = res.items;
  loading.value = false;
}

onMounted(async () => {
  await getFoods();
});

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
