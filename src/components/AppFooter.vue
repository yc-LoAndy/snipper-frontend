<template>
  <div class="d-flex justify-content-center" style="background-color: #211f1f; height: 100px;">
    <div class=" d-flex align-items-center">
      <ButtonTag variant="text" label="Github-frontend" icon="pi pi-github" severity="secondary" style="margin: 0 10px;"
        @click="frontendRepo" />
      <ButtonTag variant="text" label="Github-backend" icon="pi pi-github" severity="secondary" style="margin: 0 10px;"
        @click="backendRepo" />
    </div>
  </div>
</template>

<script setup lang="ts">
const frontendRepo = () => window.open('https://github.com/yc-LoAndy/snipper-frontend', '_blank', 'noopener,noreferrer');
const backendRepo = () => window.open('https://github.com/yc-LoAndy/snipper', '_blank', 'noopener,noreferrer');
</script>
