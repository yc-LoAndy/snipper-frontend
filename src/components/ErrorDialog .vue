<template>
  <DialogTag v-model:visible="showErrorDialog" modal :header="errorHeader" :closable="false" style="width: 20%;">
    <p>{{ errorMessage }}</p>
    <div style="display: flex; justify-content: center;">
      <ButtonTag size="small" severity="secondary" label="Got it" @click="showErrorDialog = false" autofocus />
    </div>
  </DialogTag>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showErrorDialog = ref(false);
const errorHeader = ref('');
const errorMessage = ref('');

const showError = (header: string, message: string) => {
  errorHeader.value = header;
  errorMessage.value = message;
  showErrorDialog.value = true;
};

defineExpose({ showError });
</script>
