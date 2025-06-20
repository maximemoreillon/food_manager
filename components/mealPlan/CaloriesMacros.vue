<template>
  <div class="wrapper">
    <div class="target_bar" :style="target_bar_style"></div>

    <div class="calories_bar" :style="calorie_bar_style">
      <div
        class="macro_bar"
        v-for="(value, key) in macronutrients"
        :key="`bar_${key}`"
        :style="macro_bar_style(key)"
      ></div>
    </div>
  </div>
</template>
<script>
// TODO: composition API syntax
export default {
  name: "CalorieMacros",
  props: {
    calories: {
      type: Number,
      default: () => 0,
    },
    target: {
      type: Number,
      default() {
        // TODO: get that from somewhere
        const target = 2500;
        return Number(target);
      },
    },
    macronutrients: {
      type: Object,
      default: () => ({ protein: 0, fat: 0, carbohydrates: 0 }),
    },
  },
  data() {
    return {
      colors,
    };
  },
  methods: {
    macro_bar_style(macro) {
      return {
        width: `${
          (100 * this.macronutrients[macro]) / this.macros_total_mass
        }%`,
        "background-color": this.colors[macro],
        // A bit dirty, rounding out corners
        "border-top-right-radius": macro === "carbohydrates" ? "0.25em" : "0",
        "border-bottom-right-radius":
          macro === "carbohydrates" ? "0.25em" : "0",
        "border-top-left-radius": macro === "protein" ? "0.25em" : "0",
        "border-bottom-left-radius": macro === "protein" ? "0.25em" : "0",
      };
    },
  },
  computed: {
    calorie_to_target_ratio() {
      return this.calories / this.target;
    },
    calorie_bar_style() {
      return {
        width: `${(100 * this.calories) / this.calorie_bar_max}%`,
      };
    },
    target_bar_style() {
      return {
        width: `${100 * (this.target / this.calorie_bar_max)}%`,
        "border-color": this.calories < this.target ? "#dddddd" : "#c00000",
      };
    },

    macros_total_mass() {
      const { protein, fat, carbohydrates } = this.macronutrients;
      return protein + fat + carbohydrates;
    },
    calorie_bar_max() {
      return Math.max(this.target, this.calories);
    },
    targetModel: {
      get() {
        return this.target;
      },
      set(value) {
        this.$emit("update:target", value);
      },
    },
  },
};
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
</style>
