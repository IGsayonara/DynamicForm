<template>
  <VTextField
    v-model="input.value"
    :bg-color="input.color"
  />
</template>

<script setup lang="ts">
  import { IDynamicInput } from '@/types/dynamic-input.type';

  defineProps<{input: IDynamicInput}>();
</script>

<style scoped>

</style>
