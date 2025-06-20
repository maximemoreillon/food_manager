<template>
  <v-card :loading="loading">
    <template v-if="!error && food && !loading">
      <v-toolbar flat>
        <v-btn icon="mdi-arrow-left" to="/foods" exact />
        <v-toolbar-title>{{ food.name || "unnnamed food" }}</v-toolbar-title>
        <v-spacer />

        <!-- <LabelParsing @parsed="handleParsedLabel" icon /> -->

        <v-btn
          icon="mdi-content-save"
          @click="update_food()"
          :loading="saving"
        />
        <v-btn
          icon="mdi-delete"
          color="#c00000"
          @click="deleteFood()"
          :loading="deleting"
        />
      </v-toolbar>
      <v-divider />

      <v-img
        v-if="food.image"
        class="mt-3"
        height="300"
        :src="imageSrc(food._id)"
        contain
      />

      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field label="name" v-model="food.name" />
          </v-col>
          <v-col cols="auto">
            <v-checkbox label="Hidden" v-model="food.hidden" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Serving size"
              type="number"
              v-model.number="food.serving.size"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field label="unit" v-model="food.serving.unit" />
          </v-col>
          <v-col cols="5">
            <v-text-field
              label="Calories per serving"
              v-model.number="food.serving.calories"
              type="number"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Protein [g]"
              v-model.number="food.serving.macronutrients.protein"
              type="number"
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Fat [g]"
              v-model.number="food.serving.macronutrients.fat"
              type="number"
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Carbs [g]"
              v-model.number="food.serving.macronutrients.carbohydrates"
              type="number"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox label="Vendor" v-model="food.vendor" :items="vendors" />
          </v-col>
          <v-col>
            <v-text-field
              label="Price"
              v-model.number="food.serving.price"
              type="number"
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
            <v-row>
              <v-col>
                <v-text-field label="Barcode" v-model="food.barcode" />
              </v-col>
              <v-col cols="auto">
                <!-- <BarcodeReaderDialog @decode="$set(food, 'barcode', $event)" /> -->
              </v-col>
            </v-row>
            <v-row dense justify="center" v-if="food.barcode">
              <v-col cols="auto">
                <!-- <VueBarcode
                  :value="food.barcode"
                  :options="{ displayValue: false }"
                /> -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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

<script lang="ts" setup>
import type { FoodT } from "~/server/models/food.schema";

const route = useRoute();

// TODO: populate vendors
const vendors = ref([]);

const deleting = ref(false);
const saving = ref(false);

// TODO: is this really how type safety should be enforced?
const {
  data: food,
  pending: loading,
  error,
} = await useFetch<FoodT>(`/api/foods/${route.params._id}`);

const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

async function update_food() {
  saving.value = true;
  const opts = { method: "PATCH", body: food.value };
  // @ts-ignore
  await $fetch(`/api/foods/${route.params._id}`, opts);
  saving.value = false;

  snackbar.value.show = true;
  snackbar.value.text = "Food saved";
}

async function deleteFood() {
  if (!confirm("Delete food?")) return;
  deleting.value = true;
  // @ts-ignore
  await $fetch(`/api/foods/${route.params._id}`, { method: "DELETE" });
  deleting.value = false;
  navigateTo("/foods");
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
</script>
