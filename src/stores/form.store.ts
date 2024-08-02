import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { v4 } from 'uuid';

const minInputLimit = 1;
const maxInputLimit = 10;
const initialLength = 3;

interface DynamicInput {
  id: string;
  value: string;
}

export const useFormStore = defineStore('form', () => {
  const inputs = ref<DynamicInput[]>([]);
  const searchValue = ref('');

  const canRemoveInput = computed<boolean>(() => inputs.value.length > minInputLimit);
  const canAddInput = computed<boolean>(() => inputs.value.length < maxInputLimit);

  const addInput = () => {
    if (!canAddInput.value) {
      console.warn('Cannot add an input');
      return;
    }

    inputs.value.push({
      id: v4(),
      value: '',
    });
  };

  const updateSearchValue = (value: string) => {
    searchValue.value = value;
  };

  const updateInputValue = (id: string, value: string) => {
    const input = inputs.value.find(el => el.id === id);
    if (!input) {
      console.warn(`Cannot find input with id ${id}`);
      return;
    }

    input.value = value;
  };

  const removeInput = (id: string) => {
    if (!canRemoveInput.value) {
      console.warn('Cannot remove the input');
      return;
    }

    const index = inputs.value.findIndex(el => el.id === id);
    inputs.value.splice(index, 1);
  };

  // initialization
  for (let i = 0; i < initialLength; i++) {
    addInput();
  }

  return { inputs, searchValue, canRemoveInput, canAddInput, updateInputValue, updateSearchValue, addInput, removeInput };
});
