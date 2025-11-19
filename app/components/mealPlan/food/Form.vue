<template>
  <v-form @submit.prevent="submit()" v-if="food">
    <v-row>
      <v-col>
        <v-text-field label="Food name" v-model="food.name" />
      </v-col>
      <v-col cols="3">
        <v-text-field label="Quantity" v-model.number="quantity" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          type="number"
          label="Serving size"
          v-model.number="food.serving.size"
        />
      </v-col>
      <v-col>
        <v-text-field label="Unit" v-model="food.serving.unit" />
      </v-col>
      <v-col>
        <v-text-field
          type="number"
          label="Calories [kcal]"
          v-model.number="food.serving.calories"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Protein [g]"
          type="number"
          v-model="food.serving.macronutrients.protein"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Fat [g]"
          type="number"
          v-model="food.serving.macronutrients.fat"
        />
      </v-col>
      <v-col>
        <v-text-field
          label="Carbs [g]"
          type="number"
          v-model="food.serving.macronutrients.carbohydrates"
        />
      </v-col>
    </v-row>

    <v-row justify="end">
      <v-col cols="auto" v-if="openAi?.available">
        <FoodLabelParsing @parsed="handleParsedLabel" variant="outlined" />
      </v-col>
      <v-col cols="auto" v-if="!isRegistered">
        <v-btn
          @click="registerFoodInDb()"
          :loading="registering"
          prepend-icon="mdi-playlist-plus"
          text="Register in DB"
          variant="outlined"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn
          type="submit"
          color="primary"
          prepend-icon="mdi-check"
          text="Submit"
        />
      </v-col>
    </v-row>
  </v-form>

  <v-snackbar :color="snackbar.color" v-model="snackbar.show">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { FoodLabelParsing } from "#components";
import type { FoodT } from "~~/server/models/food.schema";

const { data: openAi } = await useFetch("/api/openai");
const props = defineProps<{
  mealPlanRecord?: { food: FoodT; quantity: number };
}>();

const emit = defineEmits(["submission"]);

const quantity = ref(1);
const food = ref<FoodT | null>(null);
// const registeredFoods = ref([]);

// TODO: actually check
const registering = ref(false);

const defaults = ref({
  name: "",
  serving: {
    calories: 0,
    size: 0,
    unit: "g",
    macronutrients: {
      fat: 0,
      carbohydrates: 0,
      protein: 0,
    },
  },
});

function loadFood() {
  if (props.mealPlanRecord) {
    food.value = JSON.parse(JSON.stringify(props.mealPlanRecord.food));
    quantity.value = props.mealPlanRecord.quantity;
  } else reset_inputs();
}

onMounted(async () => {
  loadFood();
});

const snackbar = ref({
  show: false,
  text: "",
  color: "green",
});
function submit() {
  emit("submission", {
    quantity: quantity.value,
    // food: JSON.parse(JSON.stringify(food.value)),
    // TODO: might need a copy
    food: food.value,
  });
  reset_inputs();
}

// TODO: typing
function handleParsedLabel(event: any) {
  if (!food.value) return;
  const { calories, protein, fat, carbohydrates, servingSize, servingUnit } =
    event;
  food.value.serving.calories = calories;
  food.value.serving.size = servingSize;
  food.value.serving.unit = servingUnit;
  food.value.serving.macronutrients.fat = fat;
  food.value.serving.macronutrients.protein = protein;
  food.value.serving.macronutrients.carbohydrates = carbohydrates;
}

const isRegistered = computed(() => {
  // TODO: isn't it enough to check if food has an _id?
  // if (!food.value) return false;
  // return registeredFoods.value.some(({ _id }) => _id === food.value?._id);
  return !!food.value?._id;
});

async function registerFoodInDb() {
  if (!confirm(`Register ${food.value?.name || "food"} in the database?`))
    return;
  registering.value = true;
  try {
    await $fetch("/api/foods", { method: "POST", body: food.value });
    snackbar.value.show = true;
    snackbar.value.text = "Food saved";
    snackbar.value.color = "success";
  } catch (error) {
    console.error(error);
    snackbar.value.show = true;
    snackbar.value.text = "Failed to save food";
    snackbar.value.color = "error";
  } finally {
    registering.value = false;
  }
}
function reset_inputs() {
  quantity.value = 1;
  food.value = JSON.parse(JSON.stringify(defaults.value));
}
</script>
