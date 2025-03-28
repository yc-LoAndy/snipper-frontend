<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const deltaY = ref(0); // Start just below the header
const speed = 1; // Speed in pixels per frame
let animationFrameId;

const move = () => {
    const maxY = window.innerHeight - 80; // Bottom limit

    if (deltaY.value < maxY) {
        deltaY.value += speed;
    } else {
        // Hide element, reset position, then show again
        deltaY.value = 0; // Instantly move back to the top
    }

    animationFrameId = requestAnimationFrame(move);
};

onMounted(() => {
    move();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId);
});
</script>

<template>
    <div class="container">
        <div class="moving-box" :style="{
            transform: `translateY(${deltaY}px)`
        }"></div>
    </div>
</template>

<style scoped>
/* Wrapper to prevent scrollbar issues */
.container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

/* The moving element */
.moving-box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 50px;
    background-color: red;
}
</style>
