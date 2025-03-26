<template>
  <div id="app">
    <ToastTag />
    <ErrorAlert />
    <LoadingSpinner />
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import ErrorAlert from './components/ApiError.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
</script>

<style>
#app {
  /* font-family: "Courier Prime", monospace; */
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
