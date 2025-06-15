<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon exact :to="{ name: 'meal_plans' }">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Meal plan</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="saveMealPlan()" :loading="saving">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>

      <v-btn icon @click="duplicate_meal_plan()" :loading="duplicating">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>

      <v-btn
        icon
        color="#c00000"
        v-if="meal_plan._id"
        @click="deleteMealPlan()"
        :loading="deleting"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
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
                @submit="add_food_to_plan($event)"
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
                width="5em"
                height="5em"
                contain
                :src="foodImageSrc(item.food)"
              />
            </template>

            <template v-slot:item.quantity="{ item }">
              <v-text-field type="number" v-model="item.quantity" />
            </template>

            <template v-slot:item.food.serving="{ item }">
              {{ item.food.serving.size }} {{ item.food.serving.unit }}
            </template>

            <template v-slot:item.remove="{ item }">
              <v-btn icon @click="remove_food_from_plan(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
  { text: "", value: "image" },
  { text: "Name", value: "food.name" },
  // { text: "Vendor", value: "food.vendor" },
  { text: "Calories [kcal]", value: "food.serving.calories" },
  { text: "Protein [g]", value: "food.serving.macronutrients.protein" },
  { text: "Fat [g]", value: "food.serving.macronutrients.fat" },
  {
    text: "Carbs [g]",
    value: "food.serving.macronutrients.carbohydrates",
  },
  { text: "Serving", value: "food.serving" },
  { text: "Quantity", value: "quantity", width: "5rem" },
  { text: "", value: "remove" },

  { text: "", value: "edit" },
]);

const { data: meal_plan, pending: loading } = await useFetch(
  `/api/mealplans/${route.params._id}`
);

async function deleteMealPlan() {
  alert("WIP");
}

async function saveMealPlan() {
  alert("WIP");
}

async function add_food_to_plan(event: any) {
  console.log(event);
  alert("WIP");
}

function foodImageSrc(foodId: string) {
  return `/api/foods/${foodId}/image`;
}

function remove_food_from_plan(item: any) {
  alert("WIP");
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
