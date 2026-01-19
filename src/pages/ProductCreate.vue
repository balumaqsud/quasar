<template>
  <q-page class="q-py-md bg-grey-1">
    <div class="app-page-container">
      <q-breadcrumbs class="q-mb-md">
        <q-breadcrumbs-el
          icon="dashboard"
          label="Products"
          :to="{ name: 'products-list' }"
        />
        <q-breadcrumbs-el label="Create" />
      </q-breadcrumbs>

      <q-card flat bordered>
        <q-card-section class="q-pa-lg">
          <div class="text-h5 text-primary q-mb-xs">Add New Product</div>
          <div class="text-body2 text-grey-7">
            Fill in the product details and click save to add it to your inventory.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <ProductForm v-model="form" @submit="handleSubmit" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import ProductForm from 'components/ProductForm.vue';
import { useProductStore, type Product } from 'stores/productStore';

const router = useRouter();
const $q = useQuasar();
const productStore = useProductStore();

const form = reactive<Partial<Product>>({
  name: '',
  category: '',
  price: 0,
  quantity: 0,
});

function handleSubmit(value: Partial<Product>) {
  try {
    productStore.addProduct({
      name: String(value.name ?? ''),
      category: String(value.category ?? ''),
      price: Number(value.price ?? 0),
      quantity: Number(value.quantity ?? 0),
    });
    $q.notify({
      type: 'positive',
      message: 'Product created successfully',
    });
    void router.push({ name: 'products-list' });
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'Failed to create product',
    });
  }
}
</script>

