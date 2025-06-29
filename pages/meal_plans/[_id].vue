<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon="mdi-arrow-left" exact to="/meal_plans" />

      <v-toolbar-title>Meal plan</v-toolbar-title>
      <v-spacer />
      <v-btn
        @click="saveMealPlan()"
        :loading="saving"
        icon="mdi-content-save"
      />

      <v-btn
        @click="duplicate_meal_plan()"
        :loading="duplicating"
        icon="mdi-content-copy"
      />

      <!-- TODO: use component -->
      <MealPlanDeleteButton />
    </v-toolbar>

    <template v-if="meal_plan && !loading">
      <v-card-text>
        <section>
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field label="Meal plan name" v-model="meal_plan.name" />
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-checkbox label="Incomplete" v-model="meal_plan.incomplete" />
            </v-col>
            <v-col cols="auto" class="mb-4">
              <v-icon class="mr-2">mdi-calendar</v-icon>
              <span>{{ new Date(meal_plan.date).toDateString() }}</span>
            </v-col>
          </v-row>
        </section>

        <section>
          <div class="text-h6 my-4">Calories and Macros</div>
          <v-row align="center" justify="space-between" dense>
            <v-col cols="auto">
              <div class="calorie_counter">
                <v-text-field
                  :error="meal_plan.calories > meal_plan.calories_target"
                  :prefix="`${meal_plan.calories.toString()}/`"
                  label="Calories"
                  type="number"
                  density="compact"
                  v-model.number="meal_plan.calories_target"
                  hide-details
                  hide-spin-buttons
                  variant="outlined"
                />
              </div>
            </v-col>

            <v-spacer />
            <v-col
              cols="auto"
              v-for="(value, key) in meal_plan.macronutrients"
              :key="key"
            >
              <v-chip :color="colors[key]" variant="flat">
                {{ Math.round(value) }}g {{ macros_label_lookup[key] }}
              </v-chip>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <MealPlanCaloriesMacros
                :target="meal_plan.calories_target"
                :calories="meal_plan.calories"
                :macronutrients="meal_plan.macronutrients"
              />
            </v-col>
          </v-row>
        </section>

        <section>
          <div class="text-h6 my-4">Foods</div>
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
            :search="search"
            :headers="foodsTableHeaders"
            :items="meal_plan.foods"
            :items-per-page="-1"
          >
            <template v-slot:item.image="{ item }">
              <v-img
                v-if="item.food.image"
                width="5em"
                contain
                :src="imageSrc(item.food, true)"
              />
            </template>

            <template v-slot:item.quantity="{ item }">
              <v-text-field
                type="number"
                v-model="item.quantity"
                hide-details
                density="compact"
              />
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
        </section>
      </v-card-text>
    </template>

    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import type { FoodT } from "~/server/models/food.schema";
import type {
  MealPlanRecord,
  MealPlanT,
} from "~/server/models/mealPlan.schema";

const route = useRoute();

const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

const search = ref("");
const saving = ref(false);
const duplicating = ref(false);

const foodsTableHeaders = ref([
  { title: "", key: "image" },
  { title: "Name", key: "food.name" },
  { title: "Calories [kcal]", key: "food.serving.calories" },
  { title: "Protein [g]", key: "food.serving.macronutrients.protein" },
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

const { data: meal_plan, pending: loading } = await useFetch<MealPlanT>(
  `/api/mealplans/${route.params._id}`
);

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
  // TODO: implement
  alert("WIP");
}

const macros_label_lookup = ref({
  protein: "protein",
  fat: "fat",
  carbohydrates: "carbs",
});
</script>

<style scoped>
.calorie_counter {
  width: 25ch;
}
</style>
