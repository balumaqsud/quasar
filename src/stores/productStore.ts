import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const STORAGE_KEY = 'products';

function loadFromStorage(): Product[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({
      ...p,
      price: Number(p.price) || 0,
      quantity: Number(p.quantity) || 0,
    }));
  } catch {
    return [];
  }
}

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>(loadFromStorage());

  watch(
    products,
    (val) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    },
    { deep: true }
  );

  function loadProducts() {
    products.value = loadFromStorage();
  }

  function addProduct(product: Omit<Product, 'id'>) {
    const nextId =
      products.value.length > 0
        ? Math.max(...products.value.map((p) => p.id)) + 1
        : 1;
    products.value.push({ ...product, id: nextId });
  }

  function updateProduct(product: Product) {
    const index = products.value.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      products.value[index] = { ...product };
    }
  }

  function deleteProduct(id: number) {
    products.value = products.value.filter((p) => p.id !== id);
  }

  function getById(id: number) {
    return products.value.find((p) => p.id === id);
  }

  return {
    products,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getById,
  };
});

