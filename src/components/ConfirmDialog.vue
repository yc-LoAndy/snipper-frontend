<template>
  <DialogTag v-model:visible="visible" modal :header="title" :closable="false" style="width: 20%;">
    <p>{{ message }}</p>
    <div style="display: flex; justify-content: center;">
      <ButtonTag size="small" label="No" @click="handleConfirm(false)" severity="secondary"
        style="margin-right: 20px;" />
      <ButtonTag size="small" label="Yes" @click="handleConfirm(true)" severity="danger" autofocus />
    </div>
  </DialogTag>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const title = ref('');
const message = ref('');
let resolvePromise: ((value: boolean) => void) | null = null;

const confirm = (dialogTitle: string, dialogMessage: string): Promise<boolean> => {
  title.value = dialogTitle;
  message.value = dialogMessage;
  visible.value = true;

  return new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });
};

const handleConfirm = (result: boolean) => {
  visible.value = false;
  if (resolvePromise) {
    resolvePromise(result);
    resolvePromise = null;
  }
};

defineExpose({ confirm });
</script>
