<template>
  <p>Vowels: {{ vowels }}</p>
</template>

<script setup lang="ts">

  import { computed } from 'vue';

  const props = defineProps<{value: string}>();

  const vowels = computed(() => {
    const vowels = props.value.match(/[aeiou]/gi);
    return vowels ? vowels.length : 0;
  });

</script>

<style scoped>

</style>
