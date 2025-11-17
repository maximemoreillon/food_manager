<template>
  <v-skeleton-loader type="article" v-if="loading" />

  <template v-if="!error && food && !loading">
    <v-breadcrumbs v-if="breadcrumbs" :items="breadcrumbs" />
    <v-row align="center">
      <!-- <v-col cols="auto">
      <v-btn icon="mdi-arrow-left" exact to="/meal_plans" />
    </v-col> -->
      <v-col cols="12" md="6">
        <h2>{{ food.name || "unnnamed food" }}</h2>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <FoodDeleteButton />
      </v-col>
      <v-col cols="auto" v-if="openAi?.available">
        <FoodLabelParsing @parsed="handleParsedLabel" />
      </v-col>
      <v-col cols="auto">
        <v-btn
          prepend-icon="mdi-content-save"
          text="Save"
          @click="updateFood()"
          :loading="saving"
          color="primary"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-text-field label="name" v-model="food.name" hide-details />
          </v-col>
          <v-col cols="auto">
            <v-checkbox label="Hidden" v-model="food.hidden" hide-details />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Serving size"
              type="number"
              v-model.number="food.serving.size"
              hide-details
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              label="unit"
              v-model="food.serving.unit"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              label="Calories per serving"
              v-model.number="food.serving.calories"
              type="number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Protein [g]"
              v-model.number="food.serving.macronutrients.protein"
              type="number"
              hide-details
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Fat [g]"
              v-model.number="food.serving.macronutrients.fat"
              type="number"
              hide-details
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Carbs [g]"
              v-model.number="food.serving.macronutrients.carbohydrates"
              type="number"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <FoodImageManagement
              :food="food"
              @upload="handleImageUploaded"
              @delete="handleImageDeleted"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4" v-if="food.image">
        <v-img :src="imageSrc(food)" max-height="100em" />
      </v-col>
    </v-row>
  </template>

  <v-snackbar :color="snackbar.color" v-model="snackbar.show">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script lang="ts" setup>
const route = useRoute();

// TODO: is this really how type safety should be enforced?
const {
  data: food,
  pending: loading,
  error,
} = await useFetch<FoodT>(`/api/foods/${route.params._id}`, { deep: true });

const saving = ref(false);
const breadcrumbs = computed(() => [
  { title: "Foods", to: "/foods", disabled: false },
  {
    title: food.value?.name || "unidentified food",
    disabed: true,
  },
]);

const { data: openAi } = await useFetch("/api/openai");

// TODO: have a better snackbar management
const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

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
    updateFood();
  }
}

async function updateFood() {
  saving.value = true;
  const opts = { method: "PATCH", body: food.value };

  try {
    // @ts-ignore
    await $fetch(`/api/foods/${route.params._id}`, opts);
    snackbar.value.show = true;
    snackbar.value.text = "Food saved";
    snackbar.value.color = "success";
  } catch (error) {
    console.error(error);
    snackbar.value.show = true;
    snackbar.value.text = "Food update failed";
    snackbar.value.color = "error";
  } finally {
    saving.value = false;
  }
}

function handleImageDeleted() {
  if (!food.value) return;
  food.value.image = undefined;
}

function handleImageUploaded({ image }: FoodT) {
  if (!food.value) return;
  // Need some extra procesing to bust cache
  food.value.image = image;
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

function handleBarcode(barcode: string) {
  if (!food.value) return;
  food.value.barcode = barcode;
}
</script>
