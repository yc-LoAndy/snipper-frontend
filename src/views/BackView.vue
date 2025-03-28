<template>
  <div class="text-background">
    <div v-for="(text, index) in scatteredTexts" :key="index" :style="getTextStyle(text)" class="background-text">
      {{ text.content }}
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@faker-js/faker';
import { onBeforeUnmount, onMounted, ref } from 'vue';

type backgroundTextType = {
  content: string,
  top: number,
  left: string,
  rowId: number
};

const rows = 14;
const cols = 6;
const horizontalOffset = 4;
const scatteredTexts = ref<backgroundTextType[]>([]);
const deltaYs = ref(Array(rows).fill(0));
const speed = 0.1; // pixels per frame
let animationFrameId: number;

const moveDown = () => {
  const maxY = document.documentElement.scrollHeight;

  for (const [i, deltaY] of deltaYs.value.entries()) {
    if (deltaY < maxY) {
      deltaYs.value[i] += speed;
    } else {
      deltaYs.value[i] = 0;
    }
  }
  animationFrameId = requestAnimationFrame(moveDown);
  // console.log(deltaYs.value);
};

const generateStaggeredGrid = () => {
  const rowHeight = document.documentElement.scrollHeight / rows;
  const colWidth = 100 / cols;
  const getFakeFileName = () => {
    while (true) {
      const f = faker.system.fileName();
      if (f.length <= 17)
        return f;
    }
  };

  scatteredTexts.value = [];

  for (let row = 0; row < rows; row++) {
    const offsetDirection = row % 2 === 0 ? 1 : -1;
    const rowOffset = offsetDirection * horizontalOffset;
    const top = (row + 0.5) * rowHeight;
    deltaYs.value[row] = top;

    for (let col = 0; col < cols; col++) {
      scatteredTexts.value.push({
        content: getFakeFileName(),
        top, left: `calc(${(col + 0.5) * colWidth}% + ${rowOffset}vw)`,
        rowId: row
      });
    }
  }
};

const getTextStyle = (text: backgroundTextType) => ({
  left: text.left,
  transform: `translateY(${deltaYs.value[text.rowId]}px)`
});

onMounted(() => {
  generateStaggeredGrid();
  moveDown();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
});

</script>

<style scoped>
.text-background {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.background-text {
  position: absolute;
  font-family: "Courier Prime", monospace;
  font-weight: 500;
  font-style: italic;
  font-size: 24px;
  opacity: 0.2;
  color: #868686;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  will-change: transform;
}

/* .background-text:hover {
  color: antiquewhite;
} */

@media (max-width: 768px) {
  .background-text {
    font-size: 16px !important;
    left: calc(var(--cell-pos) - 3vw) !important;
  }
}
</style>
