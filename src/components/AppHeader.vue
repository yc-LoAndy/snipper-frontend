<template>
  <header class="header">
    <h1 class="app-title">
      <router-link to="/">
        Snipper
      </router-link>
    </h1>
    <p class="description courier-prime-regular">Code snippet manager</p>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
}

a {
  color: inherit !important;
}

.app-title {
  color: aliceblue;
  margin: 0;
  font-size: 50px;
  letter-spacing: 1px;
}

.description {
  margin-top: 5px;
  font-size: 16px;
  color: #847676;
}
</style>
