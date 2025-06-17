<template>
  <v-row align="center">
    <v-col>
      <v-file-input v-model="newImage" label="image" accept="image/*" />
    </v-col>
    <v-col cols="auto">
      <v-btn :disabled="!newImage" @click="upload()" :loading="uploading">
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
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { FoodT } from "~/shared/types";

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
  // TODO: error handling
  const res = await $fetch(`/api/foods/${props.food._id}/image`, {
    method: "POST",
    body,
  });
  // TODO: emit result
  // TODO: snackbar
  uploading.value = false;
  emit("upload", res);
}

function deleteFoodImage() {
  emit("delete");
}
</script>
