import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DynamicInput from '../DynamicInput.vue';
import { DynamicInputComposable } from '@/composables/dynamic-input.composable';

vi.mock('lodash.debounce', () => {
  return {
    default: (fn: Function) => fn,
  };
});

const composable: DynamicInputComposable = {
  input: {
    id: 'randomId',
    color: 'red',
    value: 'test value',
  },
  setColorValue: vi.fn(),
  setInputValue: vi.fn(),
};

describe('DynamicInput', () => {
  it('renders and binds props correctly', () => {
    const wrapper = mount(DynamicInput, {
      props: { composable },
    });

    const textField = wrapper.findComponent({ name: 'VTextField' });

    expect(textField.exists()).toBe(true);
    expect(textField.props('bgColor')).toBe('red');
    expect(textField.props('modelValue')).toBe('test value');
  });

  it('calls setInputValue on input event', async () => {
    const wrapper = mount(DynamicInput, {
      props: { composable },
    });

    const textField = wrapper.findComponent({ name: 'VTextField' });

    textField.element.value = 'new value';
    await textField.trigger('input');

    expect(composable.setInputValue).toHaveBeenCalledWith('new value');
  });
});
