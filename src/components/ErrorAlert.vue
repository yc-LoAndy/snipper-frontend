<template>
  <div v-if="error" class="alert alert-danger alert-dismissible fade show fixed-top m-3" role="alert">
    {{ error }}
    <button type="button" class="btn-close" @click="clearError"></button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { apiError } from '../utils/errorHandler';

const error = computed(() => apiError.value);

const clearError = () => {
  apiError.value = null;
};
</script>

<style scoped>
.fixed-top {
  z-index: 1050;
  width: 100%;
  max-width: 400px;
}
</style>
