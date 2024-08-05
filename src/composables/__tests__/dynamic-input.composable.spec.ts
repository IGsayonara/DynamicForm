import { fireEvent, render, screen } from '@testing-library/vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import DynamicFormComponent from '@/components/DynamicForm.vue';
import configService from '@/config/config';

vi.mock('@/composables/dynamic-input.composable', () => ({
  useDynamicInput: vi.fn(() => ({
    input: { id: `mock-id-${Math.random()}`, value: '', color: '' },
    setColorValue: vi.fn(),
    setInputValue: vi.fn(),
  })),
}));

describe('DynamicForm Integration Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with the correct number of inputs', async () => {
    render(DynamicFormComponent);
    const inputs = await screen.findAllByLabelText(/Input \d+/);
    expect(inputs).toHaveLength(configService.getConfig('initialLength'));
  });

  it('adds a new input correctly', async () => {
    const { getByText, findAllByLabelText } = render(DynamicFormComponent);

    const addButton = getByText('Add row').parentElement as HTMLButtonElement;
    await fireEvent.click(addButton);

    const inputs = await findAllByLabelText(/Input \d+/);
    expect(inputs).toHaveLength(configService.getConfig('initialLength') + 1);
  });

  it('removes an input correctly', async () => {
    const { getAllByText, findAllByLabelText } = render(DynamicFormComponent);

    const removeButtons = getAllByText('Delete row');
    await fireEvent.click(removeButtons[0]);

    const inputs = await findAllByLabelText(/Input \d+/);
    expect(inputs).toHaveLength(configService.getConfig('initialLength') - 1);
  });

  it('does not exceed the maximum number of inputs', async () => {
    const { getByText, findAllByLabelText } = render(DynamicFormComponent);

    const maxLimit = configService.getConfig('maxInputLimit');
    for (let i = 0; i < maxLimit - configService.getConfig('initialLength'); i++) {
      await fireEvent.click(getByText('Add row').parentElement as HTMLButtonElement);
    }

    const addButton = getByText('Add row').parentElement as HTMLButtonElement;
    await fireEvent.click(addButton);

    const inputs = await findAllByLabelText(/Input \d+/);
    expect(inputs).toHaveLength(maxLimit);
    expect(addButton.disabled).toBeTruthy();
  });

  it('does not allow removing below minimum number of inputs', async () => {
    const { getAllByText, findAllByLabelText } = render(DynamicFormComponent);

    const removeButtons = getAllByText('Delete row');
    const initialLength = configService.getConfig('initialLength');
    for (let i = 0; i < initialLength - 1; i++) {
      await fireEvent.click(removeButtons[i]);
    }

    const inputs = await findAllByLabelText(/Input \d+/);
    expect(inputs).toHaveLength(1); // Minimum length should be maintained
  });

  it('displays correct vowel counts next to each input field', async () => {
    const { findAllByLabelText } = render(DynamicFormComponent);

    const inputFields = await findAllByLabelText(/Input \d+/);
    const vowelCountElements = screen.getAllByText(/Vowels:/);

    inputFields.forEach((input, index) => {
      const value = (input as HTMLInputElement).value;
      const expectedVowelCount = (value.match(/[aeiou]/gi) || []).length;
      expect(vowelCountElements[index].textContent).toBe(`Vowels: ${expectedVowelCount}`);
    });
  });

  describe('Search Functionality', () => {
    it('highlights matching inputs when searching', async () => {
      const { getByLabelText, findAllByLabelText } = render(DynamicFormComponent);

      const searchInput = getByLabelText('Search');
      await fireEvent.update(searchInput, 'mock');

      const highlightedInputs = await findAllByLabelText(/Input \d+/);
      const expectedColor = configService.getConfig('matchedInputColor');

      await Promise.all(highlightedInputs.map(async input => {
        const inputText = input.textContent?.trim() || '';
        const computedStyle = getComputedStyle(input);

        if (inputText.includes('mock')) {
          expect(computedStyle.backgroundColor).toBe(expectedColor);
        } else {
          expect(computedStyle.backgroundColor).not.toBe(expectedColor);
        }
      }));
    });
  });
});
