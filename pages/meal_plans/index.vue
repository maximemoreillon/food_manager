<template>
  <v-card>
    <v-toolbar flat>
      <v-row align="center">
        <v-col>
          <v-toolbar-title> Meal plans </v-toolbar-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <!-- <v-btn :to="{ name: 'new_meal_plan' }" color="primary">
            <v-icon left>mdi-plus</v-icon>
            <span>New</span>
          </v-btn> -->
          <MealPlanCreateDialog />
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-data-table-server
        :loading="pending"
        :headers="headers"
        :items="data.items"
        :items-length="data.total"
      >
        <template v-slot:item.name="{ item }">
          <NuxtLink :href="`/meal_plans/${item._id}`">
            {{ item.name }}
          </NuxtLink>
        </template>

        <template v-slot:item.date="{ item }">
          <span>{{ formatted_date(item.date) }}</span>
        </template>

        <template v-slot:item.calories="{ item }">
          {{ item.calories }}/{{ item.calories_target }}
        </template>

        <template v-slot:item.macronutrients="{ item }">
          <!-- <CalorieMacros
            :target="item.calories_target"
            :calories="item.calories"
            :macronutrients="item.macronutrients"
          /> -->
        </template>

        <template v-slot:item.incomplete="{ item }">
          <v-icon v-if="item.incomplete"> mdi-alert </v-icon>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const { data, pending } = await useFetch("/api/mealplans");

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Date", key: "date" },
  { title: "Calories", key: "calories" },
  { title: "Macros", key: "macronutrients" },
  { title: "Incomplete", key: "incomplete" },
]);

function formatted_date(date_string: string) {
  return new Date(date_string).toDateString();
}
</script>
