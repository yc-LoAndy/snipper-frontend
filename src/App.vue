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
  font-family: "Kumbh Sans", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "YOPQ" 300;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
