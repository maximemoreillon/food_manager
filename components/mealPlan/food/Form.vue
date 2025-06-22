<template>
  <!-- TODO: v-if breaks everything -->
  <v-form @submit.prevent="submit()" v-if="food">
    <v-row>
      <v-col>
        <v-text-field label="Food name" v-model="food.name" />
      </v-col>
      <v-col cols="3">
        <v-text-field label="Quantity" v-model.number="quantity" />
      </v-col>
      <v-col cols="auto" v-if="openAiEnabled">
        <FoodLabelParsing @parsed="handleParsedLabel" />
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
          :color="colors.protein"
          label="Protein [g]"
          type="number"
          v-model="food.serving.macronutrients.protein"
        />
      </v-col>
      <v-col>
        <v-text-field
          :color="colors.fat"
          label="Fat [g]"
          type="number"
          v-model="food.serving.macronutrients.fat"
        />
      </v-col>
      <v-col>
        <v-text-field
          :color="colors.carbohydrates"
          label="Carbs [g]"
          type="number"
          v-model="food.serving.macronutrients.carbohydrates"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-spacer></v-spacer>
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

    <!-- <template v-slot:action="{ attrs }">
      <v-btn text dark v-bind="attrs" @click="snackbar.show = false">
        Close
      </v-btn>
    </template> -->
  </v-snackbar>
</template>

<script setup lang="ts">
import { FoodLabelParsing } from "#components";
import type { FoodT } from "~/server/models/food.schema";

const props = defineProps<{
  mealPlanRecord?: { food: FoodT; quantity: number };
}>();

const emit = defineEmits(["submission"]);

const quantity = ref(1);
const food = ref<FoodT | null>(null);
// const registeredFoods = ref([]);

// TODO: actually check
const openAiEnabled = ref(true);
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
  text: null,
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

function handleParsedLabel() {
  alert("WIP");
}

const isRegistered = computed(() => {
  // TODO: isn't it enough to check if food has an _id?
  // if (!food.value) return false;
  // return registeredFoods.value.some(({ _id }) => _id === food.value?._id);
  return !!food.value?._id;
});

async function registerFoodInDb() {
  registering.value = true;
  const res = await $fetch("/api/foods", { method: "POST", body: food.value });
  // TODO: snackbar
  registering.value = false;
}
function reset_inputs() {
  quantity.value = 1;
  food.value = JSON.parse(JSON.stringify(defaults.value));
}
</script>
