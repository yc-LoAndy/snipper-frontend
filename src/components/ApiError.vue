<template>
  <div class="card flex justify-center" role="alert">
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { apiError } from '../utils/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

watch(apiError, (newError) => {
  if (newError) {
    toast.add({
      severity: 'error',
      summary: 'API Error',
      detail: newError,
      life: 5000,
    });
  }
});
</script>
