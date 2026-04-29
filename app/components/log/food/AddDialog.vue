<template>
  <v-dialog max-width="80rem" v-model="dialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        text="Add"
      />
    </template>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Add food to log</v-toolbar-title>
        <v-spacer />

        <v-btn @click="dialog = false" icon="mdi-close" />

        <template v-slot:extension>
          <v-tabs v-model="tab">
            <v-tab>
              <v-icon>mdi-database</v-icon>
            </v-tab>
            <v-tab>
              <v-icon>mdi-plus</v-icon>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item>
            <RegisteredFoodsTable
              :open="dialog"
              :log="log"
              @foodAdded="$emit('add', $event)"
            />
          </v-tabs-window-item>
          <v-tabs-window-item>
            <LogFoodForm
              @submission="
                $emit('add', $event);
                dialog = false;
              "
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { LogT } from "~~/server/models/log.schema";

const dialog = ref(false);
const tab = ref(null);
defineProps<{ log: LogT }>();
</script>
