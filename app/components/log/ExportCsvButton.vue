<template>
  <v-btn
    @click="exportCsv"
    prepend-icon="mdi-file-delimited-outline"
    text="Export"
  />
</template>

<script setup lang="ts">
import type { LogT } from "~~/server/models/log.schema";

const props = defineProps<{ log: LogT }>();

const round = (value: number) => Math.round(value * 100) / 100;

function exportCsv() {
  const csv = toCsv(
    [
      "Name",
      "Quantity",
      "Serving size",
      "Serving unit",
      "Calories",
      "Protein",
      "Fat",
      "Carbohydrates",
      "Total calories",
      "Total protein",
      "Total fat",
      "Total carbohydrates",
    ],
    props.log.foods.map(({ food, quantity }) => {
      const { serving } = food;
      const macros = serving?.macronutrients;
      return [
        food.name,
        quantity,
        serving?.size,
        serving?.unit,
        serving?.calories,
        macros?.protein,
        macros?.fat,
        macros?.carbohydrates,
        round(quantity * (serving?.calories ?? 0)),
        round(quantity * (macros?.protein ?? 0)),
        round(quantity * (macros?.fat ?? 0)),
        round(quantity * (macros?.carbohydrates ?? 0)),
      ];
    }),
  );

  const name = props.log.name?.replace(/[^\w-]+/g, "_") || "log";
  downloadCsv(`${name}.csv`, csv);
}
</script>
