<template>
  <v-skeleton-loader type="article" v-if="loading" />
  <div v-else-if="error" class="text-error text-center">Error loading data</div>
  <template v-else-if="meal_plan">
    <v-breadcrumbs v-if="breadcrumbs" :items="breadcrumbs" />
    <v-row align="center">
      <!-- <v-col cols="auto">
      <v-btn icon="mdi-arrow-left" exact to="/meal_plans" />
    </v-col> -->
      <v-col cols="12" md="6">
        <h2>Meal plan</h2>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <MealPlanDeleteButton />
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="duplicate_meal_plan()"
          :loading="duplicating"
          prepend-icon="mdi-content-copy"
          text="Duplicate"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="saveMealPlan()"
          :loading="saving"
          prepend-icon="mdi-content-save"
          text="Save"
          color="primary"
        />
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12" md="6">
        <v-text-field
          label="Meal plan name"
          v-model="meal_plan.name"
          hide-details
        />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-checkbox
          label="Incomplete"
          v-model="meal_plan.incomplete"
          hide-details
        />
      </v-col>
      <v-col cols="auto">
        <v-icon class="mr-2">mdi-calendar</v-icon>
        <span>{{ new Date(meal_plan.date).toDateString() }}</span>
      </v-col>
    </v-row>

    <h3 class="my-4">Calories and Macros</h3>
    <v-row align="center" justify="space-between" dense>
      <v-col cols="12" md="3">
        <v-text-field
          :error="calorie_total > meal_plan.calories_target"
          :prefix="`${calorie_total.toString()}/`"
          label="Calories"
          type="number"
          density="compact"
          v-model.number="meal_plan.calories_target"
          hide-details
          hide-spin-buttons
          variant="outlined"
        />
      </v-col>

      <v-spacer />
      <v-col md="auto" cols="12">
        <v-row dense justify-md="start" justify="space-between">
          <v-col cols="auto" v-for="macro in macroKeys" :key="macro">
            <v-chip :color="colors[macro]" variant="flat">
              {{ Math.round(macros_total[macro]) }}g
              {{ macros_label_lookup[macro] }}
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <MealPlanCaloriesMacros
          :target="meal_plan.calories_target"
          :calories="calorie_total"
          :macronutrients="macros_total"
        />
      </v-col>
    </v-row>

    <h3 class="my-4">Foods</h3>
    <v-row align="center">
      <v-col>
        <v-text-field
          v-model="search"
          clearable
          prepend-inner-icon="mdi-magnify"
          label="Search"
          hide-details
        />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <MealPlanFoodAddDialog
          :meal_plan="meal_plan"
          @add="addFoodToMealPlan($event)"
        />
      </v-col>
    </v-row>

    <v-data-table
      class="mt-4"
      :search="search"
      :headers="foodsTableHeaders"
      :items="meal_plan.foods"
      :items-per-page="-1"
      hide-default-footer
    >
      <template v-slot:item.image="{ item }">
        <v-img width="4em" contain :src="imageSrc(item.food, true)" />
      </template>

      <template v-slot:item.quantity="{ item }">
        <v-text-field
          type="number"
          v-model="item.quantity"
          hide-details
          density="compact"
        />
      </template>

      <template
        v-for="macro in macroKeys"
        v-slot:[`item.food.serving.macronutrients.${macro}`]="{ item }"
      >
        <v-chip :color="colors[macro]" variant="flat">
          {{ item.food.serving.macronutrients[macro] }}
        </v-chip>
      </template>

      <template v-slot:item.food.serving="{ item }">
        {{ item.food.serving.size }} {{ item.food.serving.unit }}
      </template>

      <template v-slot:item.remove="{ index }">
        <v-btn
          icon="mdi-delete"
          @click="remove_food_from_plan(index)"
          variant="flat"
        />
      </template>

      <template v-slot:item.edit="{ item, index }">
        <MealPlanFoodEditDialog
          :mealPlanRecord="item"
          @edit="updateMealPlanFood(index, $event)"
        />
      </template>
    </v-data-table>
  </template>

  <v-snackbar :color="snackbar.color" v-model="snackbar.show">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import type { FoodT } from "~~/server/models/food.schema";
import type {
  MealPlanRecord,
  MealPlanT,
} from "~~/server/models/mealPlan.schema";

const route = useRoute();

const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

const breadcrumbs = computed(() => [
  { title: "Meal plans", to: "/meal_plans", disabled: false },
  {
    title: meal_plan.value?.name || "unidentified food",
    disabed: true,
  },
]);

const search = ref("");
const saving = ref(false);
const duplicating = ref(false);

onMounted(() => {
  document.addEventListener("keydown", handleKeydownEvents);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeydownEvents);
});

function handleKeydownEvents(e: KeyboardEvent) {
  // CTRL S
  if (e.key === "s" && e.ctrlKey) {
    e.preventDefault();
    saveMealPlan();
  }
}

const foodsTableHeaders = ref([
  { title: "", key: "image" },
  { title: "Name", key: "food.name" },
  { title: "Calories [kcal]", key: "food.serving.calories" },
  {
    title: "Protein [g]",
    key: "food.serving.macronutrients.protein",
  },
  { title: "Fat [g]", key: "food.serving.macronutrients.fat" },
  {
    title: "Carbs [g]",
    key: "food.serving.macronutrients.carbohydrates",
  },
  { title: "Serving", key: "food.serving" },
  { title: "Quantity", key: "quantity", width: "5rem" },
  { title: "", key: "remove" },

  { title: "", key: "edit" },
]);

const {
  data: meal_plan,
  pending: loading,
  error,
} = await useFetch<MealPlanT>(`/api/mealplans/${route.params._id}`, {
  deep: true,
});

async function saveMealPlan() {
  saving.value = true;
  const body = meal_plan.value;
  try {
    await $fetch(`/api/mealplans/${route.params._id}`, {
      method: "PATCH",
      body,
    });
    snackbar.value.text = `Meal plan saved`;
    snackbar.value.show = true;
  } catch (error) {
    console.error(error);
    snackbar.value.color = `error`;
    snackbar.value.text = `Meal plan updated failed`;
    snackbar.value.show = true;
  } finally {
    saving.value = false;
  }
}

async function addFoodToMealPlan(input: { food: FoodT; quantity: number }) {
  if (!meal_plan.value) throw new Error("Missing meal plan");
  const { food: new_food, quantity } = input;

  if (!new_food._id)
    return meal_plan.value.foods.push({ food: new_food, quantity });

  const found_food = meal_plan.value.foods.find(
    ({ food: { _id } }) => _id === new_food._id
  );
  if (found_food) found_food.quantity++;
  else meal_plan.value.foods.push({ food: new_food, quantity });
  snackbar.value.text = `${new_food.name} added`;
  snackbar.value.show = true;
}

function remove_food_from_plan(index: number) {
  if (!meal_plan.value) throw new Error("Missing meal plan");
  meal_plan.value.foods.splice(index, 1);
}

function updateMealPlanFood(index: number, editedRecord: MealPlanRecord) {
  if (!meal_plan.value) throw new Error("Missing meal plan");
  meal_plan.value.foods[index] = editedRecord;
}
async function duplicate_meal_plan() {
  if (!meal_plan.value) return;
  if (!confirm(`Duplicate meal plan?`)) return;
  const {
    incomplete,
    name,
    user_id,
    foods,
    macronutrients,
    calories,
    calories_target,
  } = meal_plan.value;

  const body = {
    name: `${name} (copy)`,
    incomplete,
    user_id,
    foods,
    macronutrients,
    calories,
    calories_target,
  };

  duplicating.value = true;
  try {
    const res = await $fetch<MealPlanT>(`/api/mealplans`, {
      method: "POST",
      body,
    });
    const { _id } = res;

    await navigateTo(`/meal_plans/${_id}`);
  } catch (error) {
    console.error(error);
    snackbar.value.color = `error`;
    snackbar.value.text = `Duplication failed`;
    snackbar.value.show = true;
  } finally {
    duplicating.value = false;
  }
}

const macros_label_lookup = ref({
  protein: "protein",
  fat: "fat",
  carbohydrates: "carbs",
});

function total_for_macro(macro: (typeof macroKeys)[number]) {
  if (!meal_plan.value) return 0;

  const total = meal_plan.value.foods.reduce(
    (acc, { quantity, food }) =>
      acc + quantity * food.serving.macronutrients[macro],
    0
  );
  return Math.round(total * 100) / 100;
}

const calorie_total = computed(() => {
  if (!meal_plan.value) return 0;
  const total = meal_plan.value.foods.reduce(
    (acc, { quantity, food }) => acc + quantity * food.serving.calories,
    0
  );
  return Math.round(total * 100) / 100;
});

const macros_total = computed(() => ({
  protein: total_for_macro("protein"),
  fat: total_for_macro("fat"),
  carbohydrates: total_for_macro("carbohydrates"),
}));
</script>
