<template>
  <v-dialog max-width="20rem" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-chip
        v-bind="activatorProps"
        :color="colors[macro]"
        :variant="under_minimum ? 'outlined' : 'flat'"
      >
        <v-icon v-if="under_minimum" start icon="mdi-alert" />
        {{ Math.round(total) }}g
        {{ label }}
      </v-chip>
    </template>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title class="text-capitalize">{{ label }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" @click="dialog = false" />
      </v-toolbar>
      <v-card-text class="text-center">
        <div class="text-h3 font-weight-medium" :style="{ color: colors[macro] }">
          {{ Math.round(total) }}g
        </div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          <template v-if="!minimum">no minimum set</template>
          <template v-else-if="under_minimum">
            {{ Math.round(minimum - total) }}g below the {{ minimum }}g minimum
          </template>
          <template v-else>minimum of {{ minimum }}g met</template>
        </div>
        <v-text-field
          label="Minimum (g)"
          type="number"
          density="compact"
          :color="colors[macro]"
          v-model.number="minimum"
          hide-spin-buttons
          hide-details
          variant="outlined"
          style="max-width: 10rem"
          class="mx-auto"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  macro: "protein" | "fat" | "carbohydrates";
  total: number;
}>();

const minimum = defineModel<number>({ required: true });
const dialog = ref(false);

const labels = {
  protein: "protein",
  fat: "fat",
  carbohydrates: "carbs",
};

const label = computed(() => labels[props.macro]);
const under_minimum = computed(
  () => !!minimum.value && props.total < minimum.value
);
</script>
