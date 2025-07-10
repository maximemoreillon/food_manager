<template>
  <v-card :loading="loading" class="mx-auto" max-width="50em">
    <template v-if="!error && food && !loading">
      <v-toolbar flat>
        <v-btn icon="mdi-arrow-left" to="/foods" exact />
        <v-toolbar-title>{{ food.name || "unnnamed food" }}</v-toolbar-title>
        <v-spacer />

        <v-btn
          icon="mdi-content-save"
          @click="updateFood()"
          :loading="saving"
        />
        <FoodDeleteButton />
      </v-toolbar>
      <v-divider />

      <v-img class="mt-3" height="300" :src="imageSrc(food)" contain />

      <v-card-text>
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
          <v-col cols="5">
            <v-text-field
              label="Calories per serving"
              v-model.number="food.serving.calories"
              type="number"
              hide-details
            />
          </v-col>
          <v-col cols="auto" v-if="openAi?.available">
            <FoodLabelParsing @parsed="handleParsedLabel" />
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
            <v-combobox
              label="Vendor"
              v-model="food.vendor"
              :items="vendors ? vendors : []"
              hide-details
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Price"
              v-model.number="food.serving.price"
              type="number"
              hide-details
            />
          </v-col>
        </v-row>

        <FoodImageManagement
          :food="food"
          @upload="handleImageUploaded"
          @delete="handleImageDeleted"
        />

        <v-row>
          <v-col>
            <v-row align="center">
              <v-col>
                <v-text-field
                  label="Barcode"
                  v-model="food.barcode"
                  hide-details
                />
              </v-col>
              <v-col cols="auto">
                <BarcodeReaderDialog @decode="handleBarcode" />
              </v-col>
            </v-row>
            <v-row dense justify="center" v-if="food.barcode">
              <v-col cols="auto">
                <ClientOnly>
                  <VueBarcode
                    :value="food.barcode"
                    :options="{ displayValue: false }"
                  />
                </ClientOnly>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </template>

    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts" setup>
import VueBarcode from "@chenfengyuan/vue-barcode";

const route = useRoute();

const saving = ref(false);

// TODO: is this really how type safety should be enforced?
const {
  data: food,
  pending: loading,
  error,
} = await useFetch<FoodT>(`/api/foods/${route.params._id}`);

const { data: vendors } = await useFetch<string[]>(`/api/foods/vendors`);
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
