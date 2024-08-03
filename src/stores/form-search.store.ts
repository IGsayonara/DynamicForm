import { defineStore } from 'pinia';
import { useDynamicInput } from '@/composables/dynamic-input.composable';
import { ref } from 'vue';

export const useFormSearchStore = defineStore('form-search', () => {
  const searchInput = ref(useDynamicInput());

  return { searchInput };
});
