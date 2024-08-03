import { defineStore, storeToRefs } from 'pinia';
import { useFormListStore } from '@/stores/form-list.store';
import { useFormSearchStore } from '@/stores/form-search.store';
import { watchEffect } from 'vue';

import configService from '@/config/config';

export const useFormStore = defineStore('form', () => {
  const matchedInputColor = configService.getConfig('matchedInputColor');

  const formListStore = useFormListStore();
  const formSearchStore = useFormSearchStore();

  const { inputs } = storeToRefs(formListStore);
  const { searchInput } = storeToRefs(formSearchStore);

  watchEffect(() => {
    const searchValue = searchInput.value.input.value;

    let matchCount = 0;

    inputs.value.forEach(input => {
      const inputValue = input.input.value;
      const isSearchMatch = searchValue && inputValue.includes(searchValue);

      if (isSearchMatch) {
        input.setColorValue(matchedInputColor);
        matchCount++;
      } else {
        input.setColorValue();
      }
    });

    if (matchCount === inputs.value.length && matchCount > 0) {
      searchInput.value.setColorValue(matchedInputColor);
    } else {
      searchInput.value.setColorValue();
    }
  });

  return {};
});
