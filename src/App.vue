<template>
  <div id="app">
    <ToastTag />
    <ErrorAlert />
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import ErrorAlert from './components/ApiError.vue';
</script>

<style>
#app {
  /* font-family: "Courier Prime", monospace; */
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
