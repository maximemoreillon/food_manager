<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon="mdi-arrow-left" exact :to="{ name: 'meal_plans' }" />

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

      <v-btn
        color="#c00000"
        @click="deleteMealPlan()"
        :loading="deleting"
        icon="mdi-delete"
      />
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
            <v-col cols="auto">
              <v-icon left>mdi-calendar</v-icon>
              <span>{{ new Date(meal_plan.date).toDateString() }}</span>
            </v-col>
          </v-row>
        </section>

        <section class="my-8">
          <div class="text-h6 my-4">Calories and Macros</div>
          <v-row align="baseline" justify="space-between" dense>
            <v-col cols="12" md="auto">
              <v-text-field
                :error="calorie_total > meal_plan.calories_target"
                :prefix="`${calorie_total}/`"
                label="Calories"
                color="red"
                type="number"
                outlined
                dense
                rounded
                v-model.number="meal_plan.calories_target"
              />
            </v-col>
            <v-spacer />
            <v-col cols="auto" v-for="(value, key) in macros_total" :key="key">
              <v-chip :color="colors[key]">
                {{ Math.round(value) }}g {{ macros_label_lookup[key] }}
              </v-chip>
            </v-col>
          </v-row>
          <MealPlanCaloriesMacros
            :target="meal_plan.calories_target"
            :calories="calorie_total"
            :macronutrients="macros_total"
          />
        </section>

        <section>
          <div class="text-h6 my-4">Foods</div>
          <v-row align="center">
            <v-col>
              <v-text-field
                v-model="search"
                clearable
                append-icon="mdi-magnify"
                label="Search"
                hide-details
              />
            </v-col>
            <v-col cols="auto">
              <MealPlanFoodAddDialog
                :meal_plan="meal_plan"
                @submit="addFoodToMealPlan($event)"
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
                v-if="item.foor.image"
                width="5em"
                height="5em"
                contain
                :src="foodImageSrc(item.food._id)"
              />
            </template>

            <template v-slot:item.quantity="{ item }">
              <v-text-field type="number" v-model="item.quantity" />
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

            <template v-slot:item.edit="{ item }">
              <!-- <FoodEditDialog
                :item="item"
                @submit="update_item(item, $event)"
              /> -->
            </template>
          </v-data-table>
        </section>
      </v-card-text>
    </template>

    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}

      <!-- <template v-slot:action="{ attrs }">
        <v-btn text dark v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template> -->
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
// TODO: externalize

const route = useRoute();

const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

const search = ref("");
const saving = ref(false);
const deleting = ref(false);
const duplicating = ref(false);
const foodsTableHeaders = ref([
  { title: "", key: "image" },
  { title: "Name", key: "food.name" },
  // { title: "Vendor", key: "food.vendor" },
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

const { data: meal_plan, pending: loading } = await useFetch(
  `/api/mealplans/${route.params._id}`
);

async function deleteMealPlan() {
  if (!confirm("Delete meal plan?")) return;
  deleting.value = true;
  await $fetch(`/api/mealplans/${route.params._id}`, { method: "DELETE" });
  deleting.value = false;
  navigateTo("/meal_plans");
}

async function saveMealPlan() {
  saving.value = true;
  const body = {
    ...meal_plan.value,
    calories: calorie_total.value,
    macronutrients: macros_total.value,
  };
  await $fetch(`/api/mealplans/${route.params._id}`, { method: "PATCH", body });
  saving.value = false;
}

async function addFoodToMealPlan({ food: new_food, quantity }: any) {
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

function foodImageSrc(foodId: string) {
  return `/api/foods/${foodId}/image`;
}

function remove_food_from_plan(index: number) {
  meal_plan.value.foods.splice(index, 1);
}

async function duplicate_meal_plan() {
  alert("WIP");
}

function total_for_macro(macro: "protein" | "fat" | "carbohydrates") {
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

const macros_label_lookup = ref({
  protein: "protein",
  fat: "fat",
  carbohydrates: "carbs",
});
</script>
