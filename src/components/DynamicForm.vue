<template>
  <VForm>
    <VRow>
      <VCol cols="12">
        <DynamicInput :input="searchInput.input" label="Search" />
      </VCol>
    </VRow>
    <VRow v-for="(input, index) in inputs" :key="input.id">
      <VCol class="d-flex flex-column justify-center" cols="12" md="8">
        <DynamicInput :input="input" :label="`Input ${index + 1}`" />
      </VCol>
      <VCol class="d-flex flex-column justify-center" cols="6" md="2">
        <VowelsCounter :value="input.value" />
        <div style="height: 22px" />
      </VCol>
      <VCol class="d-flex flex-column justify-center" cols="6" md="2">
        <VBtn base-color="red" :disabled="!canRemoveInput" @click="removeInput(input.id)">Delete row</VBtn>
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
  import { computed } from 'vue';
  import { useFormStore } from '@/stores/form.store';
  import { useFormSearchStore } from '@/stores/form-search.store';
  import DynamicInput from '@/components/DynamicInput.vue';
  import VowelsCounter from '@/components/VowelsCounter.vue';

  const formListStore = useFormListStore();

  const { addInput, removeInput } = useFormListStore();
  const { inputs: controllers, canRemoveInput, canAddInput } = storeToRefs(formListStore);
  const { searchInput } = useFormSearchStore();

  const inputs = computed(() => {
    return controllers.value.map(controller => {
      return controller.input;
    });
  });

  // initialize form logic
  useFormStore();

</script>

<style scoped>

</style>
