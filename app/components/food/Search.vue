<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="searchString"
      hide-details
      label="Search"
      append-inner-icon="mdi-magnify"
      @click:append-inner="submit"
    />
    <button type="submit" hidden />
  </v-form>
</template>

<script lang="ts" setup>
const props = defineProps<{ modelValue: string | undefined }>();
const emit = defineEmits(["update:modelValue"]);
const searchString = ref(props.modelValue);

function submit() {
  emit("update:modelValue", searchString.value);
}
</script>
