<template>
  <div>
    <VRow>
      <VTextField @input="onSearchInput" />
    </VRow>
    <VRow v-for="input in inputs" :key="input.id">
      <VTextField
        :base-color="(searchValue && foundMatch(input.value, searchValue)) ? 'green' : 'auto'"
        :color="(searchValue && foundMatch(input.value, searchValue)) ? 'green' : 'auto'"
        :model-value="input.value"
        @input="onInput(input.id, $event)"
      />
      <VBtn :disabled="!canRemoveInput" @click="removeInput(input.id)">{{ countVowels(input.value) }}</VBtn>
    </VRow>
    <VRow>
      <VBtn :disabled="!canAddInput" @click="addInput">Add button</VBtn>
    </VRow>
  </div>
</template>

<script setup lang="ts">
  import { useFormStore } from '@/stores/form.store';
  import { storeToRefs } from 'pinia';
  import debounce from 'lodash/debounce';
  import { computed } from 'vue';

  const formStore = useFormStore();
  const { addInput, removeInput, updateInputValue, updateSearchValue } = formStore;
  const { inputs, canRemoveInput, canAddInput, searchValue } = storeToRefs(formStore);

  const onInput = debounce((id: string, event: Event) => {
    const target = event.target as HTMLInputElement;
    updateInputValue(id, target.value);
  }, 300);

  const onSearchInput = debounce((event: Event) => {
    const target = event.target as HTMLInputElement;
    updateSearchValue(target.value);
  }, 300);

  const countVowels = computed(() => (str: string) => {
    const vowels = str.match(/[aeiou]/gi);
    return vowels ? vowels.length : 0;
  });

  const foundMatch = computed(() => (str: string, search: string) => {
    return str.split(search).length > 1;
  });

</script>

<style scoped>

</style>
