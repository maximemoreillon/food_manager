<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title>Foods</v-toolbar-title>
      <v-spacer />
      <FoodCreateDialog />
    </v-toolbar>

    <v-card-text v-if="data">
      <v-data-table-server
        :loading="pending"
        :headers="headers"
        :items="data.items"
        :items-length="data.total"
        v-model:sort-by="tableOptions.sortBy"
        v-model:items-per-page="tableOptions.itemsPerPage"
        v-model:page="tableOptions.page"
      >
        <template v-slot:top>
          <v-row align="baseline" dense>
            <v-col cols="12" md="6">
              <FoodSearch />
            </v-col>
            <v-spacer />
            <!-- <v-col cols="auto">
              <v-checkbox label="Show hidden" v-model="show_hidden" />
            </v-col> -->
          </v-row>
        </template>

        <template v-slot:item.name="{ item }">
          <NuxtLink :href="`/foods/${item._id}`">{{ item.name }}</NuxtLink>
        </template>

        <template v-slot:item.serving="{ item }">
          {{ item.serving.size }} {{ item.serving.unit }}
        </template>

        <template v-slot:item.hidden="{ item }">
          <v-icon v-if="item.hidden">mdi-check</v-icon>
        </template>

        <template v-slot:item.image="{ item }">
          <v-img
            v-if="item.image"
            width="6em"
            height="6em"
            contain
            :src="imageSrc(item._id)"
          />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const route = useRoute();
const queryParams = computed(() => route.query); // computed needed to trigger refetch
const { data, pending } = await useFetch(`/api/foods`, { query: queryParams });

// TODO: not very nice, especially type casting
const tableOptions = ref({
  page: Number(route.query.page || data.value.page),
  itemsPerPage: Number(route.query.itemsPerPage || data.value.itemsPerPage),
  sortBy: [
    {
      key: route.query.sort || data.value.sort,
      order: route.query.order || data.value.order,
    },
  ],
});

watch(
  tableOptions,
  (newVal) => {
    const { page, itemsPerPage, sortBy } = newVal;
    const query: any = {
      ...route.query,
      page: page.toString(),
      itemsPerPage: itemsPerPage.toString(),
      sort: sortBy?.at(0)?.key,
      order: sortBy?.at(0)?.order,
    };
    navigateTo({ query: { ...route.query, ...query } });
  },
  { deep: true }
);

const headers = ref([
  { title: "Image", key: "image" },
  { title: "Name", key: "name" },
  { title: "Vendor", key: "vendor" },
  { title: "Serving", key: "serving" },
  { title: "Calories [kcal]", key: "serving.calories" },
  { title: "Protein [g]", key: "serving.macronutrients.protein" },
  { title: "Fat [g]", key: "serving.macronutrients.fat" },
  { title: "Carbs [g]", key: "serving.macronutrients.carbohydrates" },
  { title: "Price", key: "serving.price" },
]);
</script>
