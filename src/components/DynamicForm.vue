<template>
  <div>
    <VRow>
      <DynamicInput :input="searchInput.input" />
    </VRow>
    <VRow v-for="input in inputs" :key="input.id">
      <DynamicInput :input="input" />
      <VBtn :disabled="!canRemoveInput" @click="removeInput(input.id)">{{ countVowels(input.value) }}</VBtn>
    </VRow>
    <VRow>
      <VBtn :disabled="!canAddInput" @click="addInput">Add button</VBtn>
    </VRow>
  </div>
</template>

<script setup lang="ts">
  import { useFormListStore } from '@/stores/form-list.store';
  import { storeToRefs } from 'pinia';
  import { computed } from 'vue';
  import { useFormStore } from '@/stores/form.store';
  import { useFormSearchStore } from '@/stores/form-search.store';
  import DynamicInput from '@/components/DynamicInput.vue';

  const formListStore = useFormListStore();
  useFormStore();

  const { addInput, removeInput } = useFormListStore();
  const { inputs: controllers, canRemoveInput, canAddInput } = storeToRefs(formListStore);
  const { searchInput } = useFormSearchStore();

  const inputs = computed(() => {
    return controllers.value.map(controller => {
      return controller.input;
    });
  });

  const countVowels = computed(() => (str: string) => {
    const vowels = str.match(/[aeiou]/gi);
    return vowels ? vowels.length : 0;
  });
</script>

<style scoped>

</style>
