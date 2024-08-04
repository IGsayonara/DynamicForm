import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useFormListStore } from '@/stores/form-list.store';
import configService from '@/config/config';

vi.mock('@/composables/dynamic-input.composable', () => ({
  useDynamicInput: vi.fn(() => ({
    input: { id: `test-id-${Math.random()}` },
    setColorValue: vi.fn(),
    setInputValue: vi.fn(),
  })),
}));

describe('useFormListStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with the correct number of inputs', () => {
    const store = useFormListStore();
    expect(store.inputs.length).toBe(configService.getConfig('initialLength'));
  });

  it('prevents adding an input when at the max limit', () => {
    const store = useFormListStore();
    const maxInputLimit = configService.getConfig('maxInputLimit');
    const initialLength = configService.getConfig('initialLength');

    for (let i = 0; i < maxInputLimit - initialLength; i++) {
      store.addInput();
    }
    expect(store.inputs.length).toBe(maxInputLimit);
    store.addInput();
    expect(store.inputs.length).toBe(maxInputLimit);
  });

  it('prevents removing an input when at the min limit', () => {
    const store = useFormListStore();
    const minInputLimit = configService.getConfig('minInputLimit');

    while (store.inputs.length > minInputLimit) {
      store.removeInput(store.inputs[0].input.id);
    }
    expect(store.inputs.length).toBe(minInputLimit);
    store.removeInput(store.inputs[0].input.id);
    expect(store.inputs.length).toBe(minInputLimit);
  });

  it('computes canAddInput correctly', () => {
    const store = useFormListStore();
    const maxInputLimit = configService.getConfig('maxInputLimit');

    while (store.inputs.length < maxInputLimit - 1) {
      store.addInput();
    }
    expect(store.canAddInput).toBe(true);

    store.addInput();
    expect(store.canAddInput).toBe(false);
  });

  it('computes canRemoveInput correctly', () => {
    const store = useFormListStore();
    const minInputLimit = configService.getConfig('minInputLimit');

    while (store.inputs.length > minInputLimit + 1) {
      store.removeInput(store.inputs[0].input.id);
    }
    expect(store.canRemoveInput).toBe(true);

    store.removeInput(store.inputs[0].input.id);
    expect(store.canRemoveInput).toBe(false);
  });
});
