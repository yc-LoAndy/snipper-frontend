<template>
  <div class="d-flex justify-content-center footer-div" style="background-color: #211f1f;">
    <div class="d-flex align-items-center">
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

<style scoped>
.footer-div {
  height: 100px;
}

@media screen and (max-width: 500px) {
  .p-button {
    font-size: 12px;
    --p-icon-size: 12px;
  }

  .footer-div {
    height: 70px;
  }
}
</style>
