<template>
  <v-dialog max-width="80rem" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        text="Add"
      />
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Add food</v-toolbar-title>
          <v-spacer />

          <!-- TODO: close button -->
          <!-- <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->

          <template v-slot:extension>
            <v-tabs v-model="tab">
              <v-tab>
                <v-icon>mdi-database</v-icon>
              </v-tab>
              <v-tab>
                <v-icon>mdi-plus</v-icon>
              </v-tab>
              <!-- <v-tab>
                <v-icon>mdi-barcode-scan</v-icon>
              </v-tab> -->
            </v-tabs>
          </template>
        </v-toolbar>
        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item>
              <!-- TODO: open is only used to reset text input... -->
              <RegisteredFoodsTable
                :open="dialog"
                :meal_plan="meal_plan"
                @foodAdded="$emit('add', $event)"
              />
            </v-tabs-window-item>
            <v-tabs-window-item>
              <MealPlanFoodForm
                @submission="
                  $emit('add', $event);
                  dialog = false;
                "
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { MealPlanT } from "~/shared/types";
const dialog = ref(false);
const tab = ref(null);
defineProps<{ meal_plan: MealPlanT }>();
</script>
