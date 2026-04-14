<template>
  <v-btn
    @click="triggerInput"
    prepend-icon="mdi-label"
    text="Parse label"
    :variant="props.variant"
    :loading="loading"
  />

  <v-file-input
    ref="fileInput"
    v-model="image"
    label="image"
    accept="image/*"
    hide-input
    @update:modelValue="parseLabel()"
    style="display: none"
  />
</template>

<script lang="ts" setup>
const image = ref<File | null>(null);
const loading = ref(false);
const props = defineProps<{
  variant?: "flat" | "text" | "elevated" | "plain" | "tonal" | "outlined";
}>();
const emit = defineEmits(["parsed"]);
const fileInput = ref(null);

function triggerInput() {
  fileInput.value?.$el.querySelector("input").click();
}

async function parseLabel() {
  if (!image.value) {
    return;
  }
  loading.value = true;
  const body = new FormData();
  body.append("image", image.value);
  try {
    const data = await $fetch(`/api/label`, { body, method: "POST" });

    emit("parsed", data);
    image.value = null;
  } catch (error) {
    alert("Label parsing failed");
  } finally {
    loading.value = false;
  }
}
</script>
