<template>
  <div class="container mt-4">
    <h5 class="mb-4">Supported programming language</h5>

    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="language-buttons">
      <button v-for="language in languages" :key="language.language" @click="selectLanguage(language)"
        class="btn btn-outline-secondary rounded-pill me-2 mb-2"
        :class="{ 'active': selectedLanguage?.language === language.language }">
        <img v-if="language.imagePath" :src="language.imagePath" class="language-icon me-2"
          @error="handleImageError($event)" />
        {{ language.language }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import api from '../utils/api'

type languageReturnType = { language: string, imagePath: string }

export default defineComponent({
  name: 'LanguageSelector',
  emits: ['language-selected'],

  setup(_, { emit }) {
    const languages = ref<languageReturnType[]>([]);
    const selectedLanguage = ref<languageReturnType | null>(null);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);

    const fetchLanguages = async () => {
      try {
        loading.value = true;
        const response = await api.get('/snippet/supported-language');
        languages.value = response.data;
      } catch (err) {
        error.value = 'Failed to load programming languages. Please try again later.';
        console.error('Error fetching languages:', err);
      } finally {
        loading.value = false;
      }
    };

    const selectLanguage = (language: languageReturnType) => {
      selectedLanguage.value = language;
      emit('language-selected', language);
    };

    const handleImageError = (event: Event) => {
      // Hide the image element if it fails to load
      const imgElement = event.target as HTMLImageElement;
      imgElement.style.display = 'none';
    };

    onMounted(() => {
      fetchLanguages();
    });

    return {
      languages,
      selectedLanguage,
      loading,
      error,
      selectLanguage,
      handleImageError
    };
  }
});
</script>

<style scoped>
h2,
.language-buttons {
  align-self: flex-start;
  margin-left: auto;
  margin-right: auto;
  padding-left: 10%;
  width: 80%;
}

.language-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.language-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  vertical-align: middle;
}

.btn-outline-secondary:hover {
  background-color: #6e9494;
  color: rgb(0, 0, 0);
}

.btn-outline-secondary.active {
  background-color: #7fd1d1;
  color: rgb(0, 0, 0);
}
</style>
