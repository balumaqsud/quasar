<template>
  <q-page class="q-py-md q-px-xs bg-grey-1">
    <div class="app-page-container">
      <!-- Page header -->
      <div class="row items-center justify-between q-mb-md">
        <div class="col-auto">
          <div class="text-h5 text-primary">Product Inventory</div>
          <div class="text-subtitle2 text-grey-7">
            Manage your product catalog and stock levels
          </div>
        </div>
      </div>

      <!-- Summary stats -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-caption text-grey-7 q-mb-xs">
                Total Products
              </div>
              <div class="text-h5">
                {{ totalProducts }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-caption text-grey-7 q-mb-xs">
                Total Quantity
              </div>
              <div class="text-h5">
                {{ totalQuantity }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-caption text-grey-7 q-mb-xs">
                Inventory Value
              </div>
              <div class="text-h5">
                {{ formatCurrency(inventoryValue) }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Products table -->
      <q-card class="shadow-1 q-mt-sm">
        <q-card-section class="row items-center justify-between q-gutter-md">
          <div>
            <div class="text-h6">Products</div>
            <div class="text-caption text-grey-7">
              All items currently in your inventory
            </div>
          </div>
          <div>
            <q-btn
              color="primary"
              unelevated
              icon="add"
              label="Add Product"
              :to="{ name: 'products-create' }"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-table
          flat
          :rows="products"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          @update:pagination="onUpdatePagination"
          :filter="filter"
          :row-class="() => 'clickable-row'"
          @row-click="onRowClick"
          no-data-label="No products found"
          no-results-label="No matching products"
          dense
        >
          <template #top>
            <div class="row items-center justify-between full-width q-gutter-sm">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="filter"
                  dense
                  outlined
                  debounce="300"
                  placeholder="Search products..."
                  clearable
                >
                  <template #append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>

          <template #body-cell-price="props">
            <q-td :props="props" class="text-right">
              {{ formatCurrency(props.row.price) }}
            </q-td>
          </template>

          <template #body-cell-quantity="props">
            <q-td :props="props" class="text-right">
              {{ props.row.quantity }}
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs text-center">
              <q-btn
                round
                dense
                flat
                color="primary"
                icon="edit"
                size="sm"
                @click.stop="goToEdit(props.row.id)"
              />
              <q-btn
                round
                dense
                flat
                color="negative"
                icon="delete"
                size="sm"
                @click.stop="confirmDelete(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- Delete confirmation -->
      <q-dialog v-model="deleteDialog.open">
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="warning" color="negative" size="md" class="q-mr-md" />
            <div>
              <div class="text-h6">Delete Product</div>
              <div class="text-body2 text-grey-7">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Delete"
              color="negative"
              @click="onDeleteConfirmed"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useProductStore } from 'stores/productStore';

const router = useRouter();
const $q = useQuasar();
const productStore = useProductStore();

const filter = ref('');

const pagination = reactive({
  page: 1,
  rowsPerPage: 10,
});

const columns: Array<{
  name: string;
  label: string;
  field: string;
  sortable?: boolean;
  align: 'left' | 'right' | 'center';
}> = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left',
  },
  {
    name: 'category',
    label: 'Category',
    field: 'category',
    sortable: true,
    align: 'left',
  },
  {
    name: 'price',
    label: 'Price',
    field: 'price',
    sortable: true,
    align: 'right',
  },
  {
    name: 'quantity',
    label: 'Quantity',
    field: 'quantity',
    sortable: true,
    align: 'right',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
];

const products = computed(() => productStore.products);

const totalProducts = computed(() => products.value.length);

const totalQuantity = computed(() =>
  products.value.reduce((sum, p) => sum + p.quantity, 0)
);

const inventoryValue = computed(() =>
  products.value.reduce((sum, p) => sum + p.price * p.quantity, 0)
);

const deleteDialog = reactive<{
  open: boolean;
  id: number | null;
}>({
  open: false,
  id: null,
});

function onUpdatePagination(val: { page: number; rowsPerPage: number }) {
  pagination.page = val.page;
  pagination.rowsPerPage = val.rowsPerPage;
}

function onRowClick(_evt: unknown, row: { id: number }) {
  void router.push({ name: 'products-detail', params: { id: row.id } });
}

function goToEdit(id: number) {
  void router.push({ name: 'products-edit', params: { id } });
}

function confirmDelete(id: number) {
  deleteDialog.open = true;
  deleteDialog.id = id;
}

function onDeleteConfirmed() {
  if (deleteDialog.id != null) {
    productStore.deleteProduct(deleteDialog.id);
    $q.notify({
      type: 'positive',
      message: 'Product deleted',
    });
  }
  deleteDialog.open = false;
  deleteDialog.id = null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

onMounted(() => {
  productStore.loadProducts();
});
</script>

<style scoped>
.clickable-row {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.clickable-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
