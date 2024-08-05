import { fireEvent, render, screen } from '@testing-library/vue';
import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import DynamicFormComponent from '@/components/DynamicForm.vue';
import configService from '@/config/config';

describe('DynamicForm Integration Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with the correct number of inputs', async () => {
    render(DynamicFormComponent);
    const inputs = await screen.findAllByLabelText(/Input \d+/);
    expect(inputs).toHaveLength(configService.getConfig('initialLength'));
  });

  describe('List Tests', () => {
    it('adds a new input correctly', async () => {
      const { getByText, findAllByLabelText } = render(DynamicFormComponent);

      const addButton = getByText('Add row');
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

    it('does not allow adding more than the maximum number of inputs', async () => {
      const { getByText, findAllByLabelText } = render(DynamicFormComponent);

      const maxLimit = configService.getConfig('maxInputLimit');
      const addButton = getByText('Add row').parentElement as HTMLButtonElement;

      // Add inputs until the maximum limit
      for (let i = 0; i < maxLimit - configService.getConfig('initialLength'); i++) {
        await fireEvent.click(addButton);
      }

      // Try adding one more input
      await fireEvent.click(addButton);

      const inputs = await findAllByLabelText(/Input \d+/);
      expect(inputs).toHaveLength(maxLimit);
      expect(addButton.disabled).toBeTruthy();
    });

    it('ensures at least one input field remains', async () => {
      const { getAllByText, findAllByLabelText } = render(DynamicFormComponent);

      const removeButtons = getAllByText('Delete row');
      const initialLength = configService.getConfig('initialLength');
      const minLimit = configService.getConfig('minInputLimit');

      // Remove inputs until only one remains
      for (let i = 0; i < initialLength - minLimit; i++) {
        await fireEvent.click(removeButtons[i]);
      }

      const disabledRemoveButtons = getAllByText('Delete row').map(span => span.parentElement as HTMLButtonElement);

      disabledRemoveButtons.forEach(button => {
        expect(button.disabled).toBeTruthy();
      });

      const inputs = await findAllByLabelText(/Input \d+/);
      expect(inputs).toHaveLength(minLimit); // At least one input should remain
    });
  });

  describe('Vowels count Tests', () => {
    it('counts vowels correctly for each input field, even with special characters', async () => {
      const { findAllByLabelText, findAllByText } = render(DynamicFormComponent);

      // Wait for all input fields and vowel count elements to be rendered
      const inputFields = await findAllByLabelText(/Input \d+/);
      const vowelCountElements = await findAllByText(/Vowels:/);

      // Create an array of promises to handle input simulation and validation
      const promises = inputFields.map(async (input, index) => {
        const value = `a!e@i#o$p%u^ ${index}`; // Unique text for each field
        await fireEvent.update(input, value);

        // Calculate expected vowel count
        const vowelCount = (value.match(/[aeiou]/gi) || []).length;
        const expectedVowelCountText = `Vowels: ${vowelCount}`;

        // Verify the vowel count for the specific field
        const vowelCountElement = vowelCountElements[index];
        expect(vowelCountElement.textContent).toBe(expectedVowelCountText);
      });

      // Await all promises to complete
      await Promise.all(promises);
    });

    it('updates vowel count correctly when input value changes', async () => {
      const { findAllByLabelText, findAllByText } = render(DynamicFormComponent);

      const inputFields = await findAllByLabelText(/Input \d+/);
      const vowelCountElements = await findAllByText(/Vowels:/);

      // Simulate user input with vowels
      await fireEvent.update(inputFields[0], 'a e i o u');
      const updatedVowelCount = 5;
      expect(vowelCountElements[0].textContent).toBe(`Vowels: ${updatedVowelCount}`);

      // Simulate user input with no vowels
      await fireEvent.update(inputFields[1], 'b c d f g');
      const updatedVowelCount2 = 0;
      expect(vowelCountElements[1].textContent).toBe(`Vowels: ${updatedVowelCount2}`);
    });

    it('handles empty strings and special characters in vowel count', async () => {
      const { findAllByLabelText, findAllByText } = render(DynamicFormComponent);

      const inputFields = await findAllByLabelText(/Input \d+/);
      const vowelCountElements = await findAllByText(/Vowels:/);

      // Test with empty input
      await fireEvent.update(inputFields[0], '');
      expect(vowelCountElements[0].textContent).toBe('Vowels: 0');

      // Test with special characters
      await fireEvent.update(inputFields[1], '!!@#%^&*()');
      expect(vowelCountElements[1].textContent).toBe('Vowels: 0');
    });
  });

  describe('Search Functionality', () => {
    it('highlights matching input fields with a green background', async () => {
      const { getByLabelText, findAllByLabelText } = render(DynamicFormComponent);

      // Simulate adding some input fields and input values
      const inputs = await findAllByLabelText(/Input \d+/);
      const searchInput = getByLabelText('Search') as HTMLInputElement;

      // Set values for each input field
      await fireEvent.update(inputs[0], 'apple');
      await fireEvent.update(inputs[1], 'banana');
      await fireEvent.update(inputs[2], 'cherry');

      // Enter search text and check for highlighting
      await fireEvent.update(searchInput, 'a');
      const expectedColor = configService.getConfig('matchedInputColor');

      const inputFields = await findAllByLabelText(/Input \d+/);

      // Verify that fields containing the search text are highlighted
      await Promise.all(inputFields.map(async input => {
        const inputText = (input as HTMLInputElement).value;
        const coloredElement = input.parentElement?.parentElement as HTMLElement;
        if (inputText.includes('a')) {
          expect(coloredElement.classList.contains(`bg-${expectedColor}`)).toBeTruthy();
        } else {
          expect(coloredElement.classList.contains(`bg-${expectedColor}`)).toBeFalsy();
        }
      }));
    });

    it('highlights the search field with a green background if all inputs match the search', async () => {
      const { getByLabelText, findAllByLabelText } = render(DynamicFormComponent);

      // Simulate adding some input fields and input values
      const inputs = await findAllByLabelText(/Input \d+/);
      const searchInput = getByLabelText('Search') as HTMLInputElement;

      // Set values for each input field
      await fireEvent.update(inputs[0], 'apple');
      await fireEvent.update(inputs[1], 'banana');
      await fireEvent.update(inputs[2], 'amazon');

      // Enter search text and check for highlighting
      await fireEvent.update(searchInput, 'a');
      const expectedColor = configService.getConfig('matchedInputColor');

      const searchInputStyledElement = searchInput.parentElement?.parentElement as HTMLElement;

      expect(searchInputStyledElement.classList.contains(`bg-${expectedColor}`)).toBeTruthy();
    });

    it('do not highlights the search field with a green background if one input doesnt match the search', async () => {
      const { getByLabelText, findAllByLabelText } = render(DynamicFormComponent);

      // Simulate adding some input fields and input values
      const inputs = await findAllByLabelText(/Input \d+/);
      const searchInput = getByLabelText('Search') as HTMLInputElement;

      // Set values for each input field
      await fireEvent.update(inputs[0], 'apple');
      await fireEvent.update(inputs[1], 'banana');
      await fireEvent.update(inputs[2], 'now');

      // Enter search text and check for highlighting
      await fireEvent.update(searchInput, 'a');
      const expectedColor = configService.getConfig('matchedInputColor');

      const searchInputStyledElement = searchInput.parentElement?.parentElement as HTMLElement;

      expect(searchInputStyledElement.classList.contains(`bg-${expectedColor}`)).toBeFalsy();
    });
  });
});
