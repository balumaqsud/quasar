<template>
  <q-page class="q-py-md bg-grey-1">
    <div class="app-page-container">
      <q-breadcrumbs class="q-mb-md">
        <q-breadcrumbs-el
          icon="dashboard"
          label="Products"
          :to="{ name: 'products-list' }"
        />
        <q-breadcrumbs-el label="Edit" />
      </q-breadcrumbs>

      <q-card v-if="loaded" flat bordered>
        <q-card-section class="q-pa-lg">
          <div class="text-h5 text-primary q-mb-xs">Edit Product</div>
          <div class="text-body2 text-grey-7">
            Update the product details and click save to apply the changes.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <ProductForm v-model="form" @submit="handleSubmit" />
        </q-card-section>
      </q-card>

      <div v-else class="column items-center justify-center q-mt-xl">
        <q-spinner size="40px" color="primary" />
        <div class="text-body2 text-grey-7 q-mt-md">Loading product...</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import ProductForm from 'components/ProductForm.vue';
import { useProductStore, type Product } from 'stores/productStore';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const productStore = useProductStore();

const loaded = ref(false);

const form = reactive<Omit<Product, 'id'> & { id?: number }>({
  name: '',
  category: '',
  price: 0,
  quantity: 0,
});

onMounted(() => {
  productStore.loadProducts();
  const idParam = route.params.id;
  const id = Number(idParam);

  if (!id || Number.isNaN(id)) {
    $q.notify({
      type: 'negative',
      message: 'Invalid product id',
    });
    void router.replace({ name: 'products-list' });
    return;
  }

  const product = productStore.getById(id);
  if (!product) {
    $q.notify({
      type: 'warning',
      message: 'Product not found',
    });
    void router.replace({ name: 'products-list' });
    return;
  }

  Object.assign(form, product);
  loaded.value = true;
});

function handleSubmit(value: Partial<Product>) {
  if (!value.id) {
    $q.notify({
      type: 'negative',
      message: 'Cannot update product: missing id',
    });
    return;
  }

  try {
    productStore.updateProduct({
      id: Number(value.id),
      name: String(value.name ?? ''),
      category: String(value.category ?? ''),
      price: Number(value.price ?? 0),
      quantity: Number(value.quantity ?? 0),
    });
    $q.notify({
      type: 'positive',
      message: 'Product updated successfully',
    });
    void router.push({ name: 'products-list' });
  } catch (err) {
    console.error(err);
    $q.notify({
      type: 'negative',
      message: 'Failed to update product',
    });
  }
}
</script>

