import { IDynamicInput } from '@/types/dynamic-input.type';
import { v4 } from 'uuid';
import { reactive } from 'vue';

const InitialColor = '';

export const useDynamicInput = (initialValue?: Omit<IDynamicInput, 'id'>) => {
  const id = v4(); // make id non-reactive

  const input: IDynamicInput = reactive({
    id,
    value: initialValue?.value || '',
    color: initialValue?.color || InitialColor,
  });

  const setInputValue = (value?: string) => {
    input.value = value ?? '';
  };

  const setColorValue = (value?: string) => {
    input.color = value ?? InitialColor;
  };

  return { input, setColorValue, setInputValue };
};

export type DynamicInputComposable = ReturnType<typeof useDynamicInput>
