<template>
  <div class="wrapper">
    <div class="target_bar" :style="target_bar_style"></div>

    <div class="calories_bar" :style="calorie_bar_style">
      <div
        class="macro_bar"
        v-for="macro in macroKeys"
        :key="macro"
        :style="macro_bar_style(macro)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  calories: number;
  target: number;
  macronutrients: Macros;
}>();

function macro_bar_style(macro: (typeof macroKeys)[number]) {
  return {
    width: `${(100 * props.macronutrients[macro]) / macros_total_mass.value}%`,
    "background-color": colors[macro],
  };
}

const calorie_to_target_ratio = computed(() => props.calories / props.target);

const macros_total_mass = computed(() => {
  const { protein, fat, carbohydrates } = props.macronutrients;
  return protein + fat + carbohydrates;
});

const target_bar_style = computed(() => ({
  width: `${100 * (props.target / calorie_bar_max.value)}%`,
  "border-color": props.calories < props.target ? "#dddddd" : "#c00000",
}));

const calorie_bar_style = computed(() => ({
  width: `${(100 * props.calories) / calorie_bar_max.value}%`,
}));

const calorie_bar_max = computed(() => Math.max(props.target, props.calories));
</script>

<style scoped>
.wrapper {
  position: relative;
  /* border: 1px solid #dddddd; */
  margin-top: 0.5em;
  border-radius: 0.5em;
  height: 2em;
  min-width: 5rem;
}

.calories_bar {
  height: 100%;
  padding: 0.25em;
  display: flex;
  transition: width 0.25s;
}

.target_bar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 0.25s;
  border: 1px solid #dddddd;
  border-radius: 0.5em;
}

.macro_bar {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #444444;
  transition: width 0.25s;
  overflow: hidden;
}

.macro_bar:first-child {
  border-top-left-radius: 0.25em;
  border-bottom-left-radius: 0.25em;
}

.macro_bar:last-child {
  border-top-right-radius: 0.25em;
  border-bottom-right-radius: 0.25em;
}
</style>
