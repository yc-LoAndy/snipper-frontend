<template>
  <div id="app">
    <ErrorAlert />
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import ErrorAlert from './components/ErrorAlert.vue';
</script>

<style>
#app {
  font-family: "Courier Prime", monospace;
  font-weight: 400;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
