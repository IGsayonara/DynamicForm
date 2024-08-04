<template>
  <VForm>
    <VRow>
      <VCol cols="12">
        <DynamicInput :composable="searchInput" label="Search" />
      </VCol>
    </VRow>
    <VRow v-for="(composable, index) in composables" :key="composable.input.id">
      <VCol class="d-flex flex-column justify-center" cols="12" md="8">
        <DynamicInput :composable="composable" :label="`Input ${index + 1}`" />
      </VCol>
      <VCol class="d-flex flex-column justify-center" cols="6" md="2">
        <VowelsCounter :value="composable.input.value" />
        <div style="height: 22px" />
      </VCol>
      <VCol class="d-flex flex-column justify-center" cols="6" md="2">
        <VBtn base-color="red" :disabled="!canRemoveInput" @click="removeInput(composable.input.id)">Delete row</VBtn>
        <div style="height: 22px" />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VBtn base-color="blue" :disabled="!canAddInput" @click="addInput">Add row</VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup lang="ts">
  import { useFormListStore } from '@/stores/form-list.store';
  import { storeToRefs } from 'pinia';
  import { useDynamicForm } from '@/composables/dynamic-form.composable';
  import { useFormSearchStore } from '@/stores/form-search.store';
  import DynamicInput from '@/components/DynamicInput.vue';
  import VowelsCounter from '@/components/VowelsCounter.vue';

  const formListStore = useFormListStore();

  const { addInput, removeInput } = useFormListStore();
  const { inputs: composables, canRemoveInput, canAddInput } = storeToRefs(formListStore);
  const { searchInput } = useFormSearchStore();

  // initialize form logic
  useDynamicForm();

</script>

<style scoped>

</style>
