<template>
  <v-dialog max-width="40rem" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        prepend-icon="mdi-label"
        text="Parse label"
        :variant="props.variant"
      />
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title> Label parsing </v-card-title>
        <v-card-text>
          <v-row align="center">
            <v-col>
              <v-file-input
                v-model="image"
                label="image"
                accept="image/*"
                hide-details
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                :disabled="!image"
                @click="parseLabel()"
                :loading="loading"
                color="primary"
              >
                <v-icon>mdi-brain</v-icon>
              </v-btn>
            </v-col>
          </v-row>
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
const image = ref<File | null>(null);
const dialog = ref(false);
const loading = ref(false);
const props = defineProps<{
  variant?: "flat" | "text" | "elevated" | "plain" | "tonal" | "outlined";
}>();
const emit = defineEmits(["parsed"]);
async function parseLabel() {
  if (!image.value) {
    alert("Image not provided");
    return;
  }
  loading.value = true;
  const body = new FormData();
  body.append("image", image.value);
  try {
    const data = await $fetch(`/api/label`, { body, method: "POST" });

    emit("parsed", data);
    dialog.value = false;
    image.value = null;
  } catch (error) {
    alert("Label parsing failed");
  } finally {
    loading.value = false;
  }
}
</script>
