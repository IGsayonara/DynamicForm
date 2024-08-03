import { defineStore, storeToRefs } from 'pinia';
import { useFormListStore } from '@/stores/form-list.store';
import { useFormSearchStore } from '@/stores/form-search.store';
import { onUnmounted, watch } from 'vue';

import configService from '@/config/config';

export const useFormStore = defineStore('form', () => {
  const matchedInputColor = configService.getConfig('matchedInputColor');

  const formListStore = useFormListStore();
  const formSearchStore = useFormSearchStore();

  const { inputs } = storeToRefs(formListStore);
  const { searchInput } = storeToRefs(formSearchStore);

  let matchCount = 0;

  // Watch for changes in the search input
  watch(() => searchInput.value.input.value, newSearchValue => {
    matchCount = 0;

    inputs.value.forEach(input => {
      const inputValue = input.input.value;
      const isSearchMatch = newSearchValue && inputValue.includes(newSearchValue);

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

  // Store watchers to clean them up later
  const inputWatchers = new Map();

  // Function to set up watchers for each input
  const setupInputWatchers = () => {
    inputs.value.forEach(input => {
      if (!inputWatchers.has(input)) {
        const unwatch = watch(() => input.input.value, (newInputValue, oldInputValue) => {
          const searchValue = searchInput.value.input.value;
          const wasMatch = searchValue && oldInputValue.includes(searchValue);
          const isMatch = searchValue && newInputValue.includes(searchValue);

          if (isMatch) {
            input.setColorValue(matchedInputColor);
            if (!wasMatch) matchCount++;
          } else {
            input.setColorValue();
            if (wasMatch) matchCount--;
          }

          if (matchCount === inputs.value.length && matchCount > 0) {
            searchInput.value.setColorValue(matchedInputColor);
          } else {
            searchInput.value.setColorValue();
          }
        });

        inputWatchers.set(input, unwatch);
      }
    });
  };

  // Watch for changes in the inputs array
  watch(() => inputs.value.length, () => {
    // Clean up watchers for removed inputs
    inputWatchers.forEach((unwatch, input) => {
      if (!inputs.value.includes(input)) {
        const searchValue = searchInput.value.input.value;
        const wasMatch = searchValue && input.input.value.includes(searchValue);
        if (wasMatch) matchCount--;

        unwatch();
        inputWatchers.delete(input);
      }
    });

    // Set up watchers for new inputs
    setupInputWatchers();

    // Update search input color if necessary
    if (matchCount === inputs.value.length && matchCount > 0) {
      searchInput.value.setColorValue(matchedInputColor);
    } else {
      searchInput.value.setColorValue();
    }
  });

  // Initial setup of input watchers
  setupInputWatchers();

  // Clean up all watchers when the component is unmounted
  onUnmounted(() => {
    inputWatchers.forEach(unwatch => unwatch());
  });

  return {};
});
