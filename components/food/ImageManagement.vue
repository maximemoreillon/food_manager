<template>
  <v-row align="center">
    <v-col>
      <v-file-input v-model="newImage" label="image" />
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
const props = defineProps<{ food: { _id: string; image: string } }>();
const uploading = ref(false);
const deleting = ref(false);
const newImage = ref<File | null>(null);

async function upload() {
  if (!newImage.value) {
    alert("Image not provided");
    return;
  }
  const body = new FormData();
  body.append("image", newImage.value);
  const res = await $fetch(`/api/foods/${props.food._id}/image`, {
    method: "POST",
    body,
  });
}

function deleteFoodImage() {}
</script>
