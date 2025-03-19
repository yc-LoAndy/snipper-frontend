<template>
  <div class="container mt-4">
    <h5 class="mb-4">Hello, {{ userName ?? userEmail ?? '' }}!</h5>

    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else>
      <div class="language-buttons">
        <button v-for="language in languages" :key="language.language" @click="selectLanguage(language)"
          class="btn btn-outline-secondary rounded-pill me-2 mb-2"
          :class="{ 'active': selectedLanguage?.language === language.language }">
          <img v-if="language.imagePath" :src="language.imagePath" class="language-icon me-2"
            @error="handleImageError($event)" />
          {{ language.language }}
        </button>
      </div>
      <div class="text-area">
        <textarea class="form-control mt-5 w-50" v-model="currentSnippetContent" placeholder="// Your code here"
          name="text-area" id="text-area">
        </textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import api from '../utils/api';
import { defineComponent, ref, onMounted, computed } from 'vue';

type languageReturnType = { language: string, imagePath: string }
type userDetailsType = {
  userEmail: string,
  userName: string,
  snippets: Record<string, { id: number, content: string }[]>
}

export default defineComponent({
  emits: ['language-selected'],

  setup(_, { emit }) {
    const languages = ref<languageReturnType[]>([]);
    const selectedLanguage = ref<languageReturnType | null>(null);
    const userDetails = ref<userDetailsType>();
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);

    const fetchLanguages = async () => {
      try {
        const response = await api.get('/snippet/supported-language');
        languages.value = response.data;
      } catch (err) {
        error.value = 'Failed to load programming languages. Please try again later.';
        console.error('Error fetching languages:', err);
      }
    };

    const fetchUserDetail = async () => {
      try {
        const response = await api.get('/user');
        userDetails.value = response.data;
      }
      catch (err) {
        error.value = 'Failed to load user details. Please try again.';
        console.error('Error fetching user details:', err);
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

    const currentSnippetContent = computed(() => {
      if (!selectedLanguage.value || !userDetails.value || !userDetails.value.snippets) {
        return '';
      }

      const matchingSnippet = userDetails.value.snippets[selectedLanguage.value.language];
      if (matchingSnippet.length === 0)
        return '';
      else
        return matchingSnippet[0].content;
    });

    onMounted(async () => {
      loading.value = true;
      await Promise.all([fetchLanguages(), fetchUserDetail()]);
      loading.value = false;
    });

    const userName = computed(() => userDetails.value?.userName);
    const userEmail = computed(() => userDetails.value?.userEmail);

    return {
      languages,
      selectedLanguage,
      userName,
      userEmail,
      loading,
      error,
      selectLanguage,
      handleImageError,
      currentSnippetContent
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

.text-area {
  display: flex;
  justify-content: center;
}
</style>
