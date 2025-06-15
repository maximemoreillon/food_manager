<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Foods</v-toolbar-title>
      <v-spacer />
      <FoodCreateDialog />
    </v-toolbar>

    <v-card-text>
      <!-- <v-data-table
        :loading="pending"
        :headers="headers"
        :items="data.items"
        :server-items-length="total"
        :options.sync="options"
      > -->
      <v-data-table-server
        :loading="pending"
        :headers="headers"
        :items="data.items"
        :items-length="data.total"
      >
        <!-- <template v-slot:top>
          <v-row align="baseline" dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                @change="get_foods()"
              />
            </v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-checkbox label="Show hidden" v-model="show_hidden" />
            </v-col>
          </v-row>
        </template> -->

        <template v-slot:item.name="{ item }">
          <!-- <router-link :to="{ name: 'food', params: { food_id: item._id } }">
            {{ item.name }}
          </router-link> -->
          <NuxtLink :href="`/foods/${item._id}`">{{ item.name }}</NuxtLink>
        </template>

        <template v-slot:item.serving="{ item }">
          {{ item.serving.size }} {{ item.serving.unit }}
        </template>

        <template v-slot:item.hidden="{ item }">
          <v-icon v-if="item.hidden">mdi-check</v-icon>
        </template>

        <template v-slot:item.image="{ item }">
          <!-- <v-img width="6em" height="6em" contain :src="image_src(item)" /> -->
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const { data, pending } = await useFetch("/api/foods");

const headers = ref([
  { title: "Image", key: "image" },
  { title: "Name", key: "name" },
  { title: "Vendor", key: "vendor" },
  { title: "Serving", key: "serving" },
  { title: "Calories [kcal]", key: "serving.calories" },
  { title: "Protein [g]", key: "serving.macronutrients.protein" },
  { title: "Fat [g]", key: "serving.macronutrients.fat" },
  { title: "Carbs [g]", key: "serving.macronutrients.carbohydrates" },
  { title: "Price", key: "serving.price" },
]);
</script>
