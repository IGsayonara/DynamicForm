<template>
  <VTextField
    :bg-color="composable.input.color"
    :model-value="composable.input.value"
    @input="onInput($event)"
  />
</template>

<script setup lang="ts">
  import { DynamicInputComposable } from '@/composables/dynamic-input.composable';
  import debounce from 'lodash.debounce';

  const props = defineProps<{composable: DynamicInputComposable}>();

  const onInput = debounce((event: InputEvent) => {
    const value = (event.target as HTMLInputElement).value;
    props.composable.setInputValue(value);
  }, 300);
</script>

<style scoped>

</style>
