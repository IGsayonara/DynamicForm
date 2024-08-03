// form.store.ts

import { defineStore, storeToRefs } from 'pinia';
import { useFormListStore } from '@/stores/form-list.store';
import { useFormSearchStore } from '@/stores/form-search.store';
import { toRefs, watch } from 'vue';

export const useFormStore = defineStore('form', () => {
  const formListStore = useFormListStore();
  const formSearchStore = useFormSearchStore();

  const { inputs } = storeToRefs(formListStore);
  const { searchInput } = storeToRefs(formSearchStore);

  // Destructure the refs to access them without `.value`
  const { value: searchValue } = toRefs(searchInput.value.input);

  watch([searchInput, inputs], () => {
    let count = 0;
    inputs.value.forEach(input => {
      const { value: inputValue } = toRefs(input.input);

      const isSearchMatch = searchValue.value && inputValue.value.includes(searchValue.value);
      if (isSearchMatch) {
        input.setColorValue('green');
        count++;
      } else {
        input.setColorValue('currentcolor');
      }
    });

    if (count === inputs.value.length) {
      searchInput.value.setColorValue('green');
    } else {
      searchInput.value.setColorValue('currentcolor');
    }
  }, { deep: true });

  return {};
});
