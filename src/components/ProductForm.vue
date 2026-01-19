<template>
  <q-form @submit.prevent="onSubmit" @reset.prevent="onReset">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-input
          v-model="localProduct.name"
          label="Product Name"
          dense
          outlined
          :rules="[valRequired]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="localProduct.category"
          label="Category"
          dense
          outlined
          :rules="[valRequired]"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model.number="localProduct.price"
          label="Price"
          dense
          outlined
          type="number"
          prefix="$"
          @focus="onNumberFocus('price')"
          @blur="onNumberBlur('price')"
          :rules="[valRequired, valIsNumber, valNonNegative]"
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model.number="localProduct.quantity"
          label="Quantity"
          dense
          outlined
          type="number"
          @focus="onNumberFocus('quantity')"
          @blur="onNumberBlur('quantity')"
          :rules="[valRequired, valIsNumber, valNonNegative]"
        />
      </div>
    </div>

    <div class="row justify-end q-gutter-sm q-mt-md">
      <q-btn
        type="reset"
        flat
        color="primary"
        icon="refresh"
        label="Reset"
      />
      <q-btn
        type="submit"
        unelevated
        color="primary"
        icon="save"
        label="Save"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Product } from 'stores/productStore';

interface Props {
  modelValue?: Partial<Product>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'submit', value: Omit<Product, 'id'> | Product): void;
  (e: 'update:modelValue', value: Partial<Product>): void;
}>();

const localProduct = reactive<Partial<Product>>({
  name: '',
  category: '',
  price: 0,
  quantity: 0,
  ...props.modelValue,
});

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(localProduct, {
      name: '',
      category: '',
      price: 0,
      quantity: 0,
      ...val,
    });
  },
  { deep: true }
);

watch(
  localProduct,
  (val) => {
    emit('update:modelValue', { ...val });
  },
  { deep: true }
);

function onNumberFocus(field: 'price' | 'quantity') {
  if (localProduct[field] === 0) {
    // Use null so the input appears empty while preserving numeric semantics
    (localProduct as Record<string, number | null>)[field] = null;
  }
}

function onNumberBlur(field: 'price' | 'quantity') {
  const value = localProduct[field] as unknown;
  if (value === null || value === '') {
    (localProduct as Record<string, number | null>)[field] = 0;
  }
}

function valRequired(val: unknown) {
  if (val === null || val === undefined) {
    return 'Required';
  }
  if (typeof val === 'object') {
    return 'Required';
  }
  // Only convert to string if it's a primitive type
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return String(val).trim().length > 0 || 'Required';
  }
  return 'Required';
}

function valIsNumber(val: unknown) {
  // Check if value is null or undefined (handled by valRequired)
  if (val === null || val === undefined) {
    return true;
  }
  // Check if it's already a valid number
  if (typeof val === 'number' && !Number.isNaN(val)) {
    return true;
  }
  // Try to convert to number and check if it's valid
  const num = Number(val);
  return (!Number.isNaN(num) && isFinite(num)) || 'Numbers required';
}

function valNonNegative(val: unknown) {
  const num = Number(val);
  return (!Number.isNaN(num) && num >= 0) || 'Must be 0 or greater';
}

function onSubmit() {
  emit('submit', localProduct as Product);
}

function onReset() {
  Object.assign(localProduct, {
    name: '',
    category: '',
    price: 0,
    quantity: 0,
  });
}
</script>

<style scoped>
.q-form {
  margin: 0;
  padding: 0;
}

.q-form > .row {
  margin-left: 0;
  margin-right: 0;
}
</style>
