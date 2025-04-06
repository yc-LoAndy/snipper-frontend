<template>
  <DialogTag v-model:visible="isInSetting" modal header="Settings" :closable="true" :style="{ width: dialogWidth }">
    <div class="d-flex mb-3 justify-content-between">
      <div class="d-flex">
        <Chip label="Text Size" style="font-size: small;" />
      </div>
      <div class="d-flex align-items-center" style="width: 65%;">
        <Slider :modelValue="textSize" v-on:update:model-value="onUpdate"></Slider>
      </div>
    </div>
    <div style="display: flex; justify-content: center;">
      <ButtonTag size="small" severity="secondary" label="OK" @click="isInSetting = false" autofocus />
    </div>
  </DialogTag>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Slider from 'primevue/slider';
import Chip from 'primevue/chip';

const isInSetting = ref(false);
const textSize = ref(20);
const emit = defineEmits(['update:textSize']);
const dialogWidth = ref('20%');

const showSettings = () => {
  isInSetting.value = true;
};
const onUpdate = (v: number | number[]) => {
  if (typeof v === 'number') {
    textSize.value = v;
    console.log(v);
    emit('update:textSize', v);
  }
};

const mediaQuery = window.matchMedia('(max-width: 500px)');
function handleMediaChange(e: MediaQueryListEvent | MediaQueryList) {
  dialogWidth.value = e.matches ? '75%' : '20%';
}
onMounted(() => {
  handleMediaChange(mediaQuery);
  mediaQuery.addEventListener('change', handleMediaChange);
});
defineExpose({ showSettings });
</script>

<style scoped>
.p-slider {
  width: 100%;
  --p-slider-range-background: #0f0e0e;
}
</style>
