<template>
  <transition name="fade">
    <div v-if="userState.isLoading" class="loading-overlay">
      <div class="spinner-grow text-secondary" role="status">
      </div>
    </div>
  </transition>
</template>

<script setup>
import useUserStateStore from '../stores/userStateStore';
const userState = useUserStateStore().$state;
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.529);
  z-index: 9999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
