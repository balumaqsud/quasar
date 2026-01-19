<template>
  <q-page padding class="bg-grey-1">
    <q-breadcrumbs class="q-mb-md">
      <q-breadcrumbs-el
        icon="dashboard"
        label="Products"
        :to="{ name: 'products-list' }"
      />
      <q-breadcrumbs-el :label="productTitle" />
    </q-breadcrumbs>

    <q-card flat bordered class="q-pa-md">
      <q-card-section class="row items-center justify-between q-gutter-md">
        <div>
          <div class="text-h5 text-primary q-mb-xs">
            {{ product?.name || 'Product Details' }}
          </div>
          <div class="text-body2 text-grey-7">
            View read-only information about this product.
          </div>
        </div>

        <div class="row q-gutter-sm">
          <q-btn
            v-if="product"
            color="primary"
            unelevated
            icon="edit"
            label="Edit"
            @click="goToEdit"
          />
          <q-btn
            flat
            color="primary"
            icon="arrow_back"
            label="Back to list"
            :to="{ name: 'products-list' }"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="product">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-7">Name</div>
            <div class="text-body1 q-mb-md">{{ product.name }}</div>

            <div class="text-caption text-grey-7">Category</div>
            <q-chip
              square
              color="primary"
              text-color="white"
              class="q-mb-md"
            >
              {{ product.category }}
            </q-chip>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-7">Price</div>
            <div class="text-body1 q-mb-md">
              {{ product.price.toFixed(2) }}
            </div>

            <div class="text-caption text-grey-7">Quantity</div>
            <div class="text-body1">
              {{ product.quantity }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-else class="text-grey-7">
        Loading product details...
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useProductStore, type Product } from 'stores/productStore';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const productStore = useProductStore();

const product = ref<Product | null>(null);

const productTitle = computed(() => product.value?.name || 'Details');

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

  const found = productStore.getById(id);
  if (!found) {
    $q.notify({
      type: 'warning',
      message: 'Product not found',
    });
    void router.replace({ name: 'products-list' });
    return;
  }

  product.value = found;
});

function goToEdit() {
  if (!product.value) return;
  void router.push({
    name: 'products-edit',
    params: { id: product.value.id },
  });
}
</script>

