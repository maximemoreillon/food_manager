<template>
  <v-card :loading="loading">
    <template v-if="food && !loading">
      <v-toolbar flat>
        <v-btn icon :to="{ name: 'foods' }" exact>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ food.name || "unnnamed food" }}</v-toolbar-title>
        <v-spacer />

        <!-- <LabelParsing @parsed="handleParsedLabel" icon /> -->

        <v-btn icon @click="update_food()" :loading="saving">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn icon color="#c00000" @click="delete_food()" :loading="deleting">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />

      <v-img class="mt-3" height="300" :src="image_src" contain />

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

        <FoodImageManagement :food="food" />

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
const route = useRoute();
const vendors = ref([]);

const deleting = ref(false);
const saving = ref(false);

const { data: food, pending: loading } = await useFetch(
  `/api/foods/${route.params._id}`
);

const snackbar = ref({
  color: "green",
  show: false,
  text: "",
});

function update_food() {
  alert("WIP");
}

function delete_food() {
  alert("WIP");
}

function delete_food_image() {
  alert("WIP");
}

// TODO: use utils
const image_src = computed(() => `/api/foods/${route.params._id}/image`);
</script>
