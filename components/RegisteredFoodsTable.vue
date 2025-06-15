<template>
  <v-data-table
    :loading="loading"
    height="50vh"
    :headers="headers"
    :items="foods"
    :search="search"
    :items-per-page="50"
    @click:row="$emit('foodAdded', { food: $event, quantity: 1 })"
  >
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
      <v-img width="5em" height="5em" contain :src="imageSrc(item._id)" />
    </template>

    <template v-slot:item.serving="{ item }">
      {{ item.serving.size }} {{ item.serving.unit }}
    </template>

    <template v-slot:item.serving.calories="{ item }">
      <v-chip
        :color="item_too_calorific(item) ? colors.calorie_excess : ''"
        outlined
      >
        {{ item.serving.calories }}
      </v-chip>
    </template>

    <template v-slot:item.food.serving="{ item }">
      {{ item.food.serving.size }} {{ item.food.serving.unit }}
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
const props = defineProps<{
  meal_plan: any;
}>();

// TODO: useFetch vs $fetch

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
const foods = ref([]);

async function getFoods() {
  loading.value = true;
  const res = await $fetch("/api/foods");
  foods.value = res.items;
  loading.value = false;
}

onMounted(async () => {
  await getFoods();
});

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
</script>
