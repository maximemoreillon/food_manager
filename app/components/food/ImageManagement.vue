<template>
  <v-row align="center">
    <v-col>
      <v-file-input
        v-model="newImage"
        label="image"
        accept="image/*"
        hide-details
      />
    </v-col>
    <v-col cols="auto">
      <v-btn
        :disabled="!newImage"
        @click="upload()"
        :loading="uploading"
        color="primary"
      >
        <v-icon>mdi-upload</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn
        color="#c00000"
        dark
        :disabled="!food.image"
        :loading="deleting"
        @click="deleteFoodImage()"
        variant="outlined"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { FoodT } from "~~/server/models/food.schema";

const props = defineProps<{ food: FoodT }>();
const emit = defineEmits(["upload", "delete"]);
const uploading = ref(false);
const deleting = ref(false);
const newImage = ref<File | null>(null);

async function upload() {
  if (!newImage.value) {
    alert("Image not provided");
    return;
  }
  uploading.value = true;
  const body = new FormData();
  body.append("image", newImage.value);
  try {
    const res = await $fetch(`/api/foods/${props.food._id}/image`, {
      method: "POST",
      body,
    });
    // TODO: snackbar
    emit("upload", res);
  } catch (error) {
    console.error(error);
    alert("Error");
  } finally {
    uploading.value = false;
  }
}

function deleteFoodImage() {
  emit("delete");
}
</script>
