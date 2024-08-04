import { describe, expect, it, vi } from 'vitest';
import { useDynamicInput } from '@/composables/dynamic-input.composable';
import { IDynamicInput } from '@/types/dynamic-input.type';

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-id'),
}));

describe('useDynamicInput', () => {
  it('initializes with default values when no initial value is provided', () => {
    const { input, setColorValue, setInputValue } = useDynamicInput();

    expect(input.id).toBe('mock-id');
    expect(input.value).toBe('');
    expect(input.color).toBe('');

    setInputValue('test value');
    expect(input.value).toBe('test value');

    setColorValue('red');
    expect(input.color).toBe('red');
  });

  it('initializes with provided values', () => {
    const initialInput: Omit<IDynamicInput, 'id'> = { value: 'initial value', color: 'initial color' };
    const { input } = useDynamicInput(initialInput);

    expect(input.id).toBe('mock-id');
    expect(input.value).toBe('initial value');
    expect(input.color).toBe('initial color');
  });

  it('correctly updates value and color using methods', () => {
    const { input, setInputValue, setColorValue } = useDynamicInput();

    setInputValue('new value');
    expect(input.value).toBe('new value');

    setColorValue('new color');
    expect(input.color).toBe('new color');
  });

  it('resets value and color to defaults when null is provided', () => {
    const { input, setInputValue, setColorValue } = useDynamicInput();

    setInputValue('new value');
    setColorValue('new color');

    setInputValue();
    setColorValue();

    expect(input.value).toBe('');
    expect(input.color).toBe('');
  });
});
