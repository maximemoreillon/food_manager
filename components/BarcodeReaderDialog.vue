<template>
  <v-dialog max-width="50rem" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="primary">
        <v-icon>mdi-barcode-scan</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Barcode reader</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row align="center" justify="center" class="mt-4">
          <v-col cols="auto">
            <StreamBarcodeReader @decode="onDecode" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { StreamBarcodeReader } from "vue-barcode-reader";

const dialog = ref(false);

const emit = defineEmits(["decode"]);

function onDecode(barcode: string) {
  console.log(barcode);
  emit("decode", barcode);
  dialog.value = false;
}
</script>
