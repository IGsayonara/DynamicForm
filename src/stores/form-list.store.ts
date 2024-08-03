import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DynamicInputComposable, useDynamicInput } from '@/composables/dynamic-input.composable';

import configService from '@/config/config';

export const useFormListStore = defineStore('form-list', () => {
  const { minInputLimit, maxInputLimit, initialLength } = configService.getConfigs();
  const inputs = ref<DynamicInputComposable[]>([]);

  const canRemoveInput = computed<boolean>(() => inputs.value.length > minInputLimit);
  const canAddInput = computed<boolean>(() => inputs.value.length < maxInputLimit);

  const addInput = () => {
    if (!canAddInput.value) {
      console.warn('Cannot add an input');
      return;
    }

    const input = useDynamicInput();
    inputs.value.push(input);
  };
  const removeInput = (id: string) => {
    if (!canRemoveInput.value) {
      console.warn('Cannot remove the input');
      return;
    }

    const index = inputs.value.findIndex(el => el.input.id === id);
    inputs.value.splice(index, 1);
  };

  // initialization
  for (let i = 0; i < initialLength; i++) {
    addInput();
  }

  return { inputs, canRemoveInput, canAddInput, addInput, removeInput };
});
