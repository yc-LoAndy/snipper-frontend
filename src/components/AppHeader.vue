<template>
  <header class="header">
    <h1 class="app-title lekton-bold">Snipper</h1>
    <p class="description courier-prime-regular">Code snippet manager</p>
    <select class="main-text" v-model="selectedLanguage" @change="handleLanguageChange">
      <option value="">All Languages</option>
      <option v-for="language in languages" :key="language" :value="language">
        {{ language }}
      </option>
    </select>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const languages = ref([
  'Python',
  'JavaScript',
  'TypeScript',
  'CSS',
  'SQL',
  'Plain Text'
]);

const selectedLanguage = ref('');

const handleLanguageChange = () => {
  // Emit an event to the parent component to update the snippet list
  emit('language-changed', selectedLanguage.value);
};

const emit = defineEmits(['language-changed']);
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-bottom: 1px solid #333;
  text-align: center;
}

.app-title {
  margin: 0;
  font-size: 70px;
  letter-spacing: 1px;
}

.description {
  margin-top: 5px;
  font-size: 16px;
  color: #847676;
}

select {
  margin-top: 10px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
