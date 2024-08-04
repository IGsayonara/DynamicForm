import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VowelCounter from '../VowelsCounter.vue'; // Adjust the path as needed

describe('VowelCounter', () => {
  it('correctly calculates the number of vowels in the input value', async () => {
    const wrapper = mount(VowelCounter, {
      props: { value: 'Hello World' },
    });
    expect(wrapper.text()).toBe('Vowels: 3'); // "e", "o", "o"

    await wrapper.setProps({ value: 'Test' });
    expect(wrapper.text()).toBe('Vowels: 1'); // "e"

    await wrapper.setProps({ value: 'Vue.js' });
    expect(wrapper.text()).toBe('Vowels: 2'); // "u", "e"
  });

  it('returns 0 for a string with no vowels', () => {
    const wrapper = mount(VowelCounter, {
      props: { value: 'bcdfghjklmnpqrstvwxyz' },
    });

    expect(wrapper.text()).toBe('Vowels: 0');
  });

  it('returns 0 for an empty string', () => {
    const wrapper = mount(VowelCounter, {
      props: { value: '' },
    });

    expect(wrapper.text()).toBe('Vowels: 0');
  });

  it('correctly handles uppercase vowels', () => {
    const wrapper = mount(VowelCounter, {
      props: { value: 'AEIOU' },
    });

    expect(wrapper.text()).toBe('Vowels: 5'); // "A", "E", "I", "O", "U"
  });

  it('correctly handles mixed case vowels', () => {
    const wrapper = mount(VowelCounter, {
      props: { value: 'aEiOu' },
    });

    expect(wrapper.text()).toBe('Vowels: 5'); // "a", "E", "i", "O", "u"
  });
});
