<template>
  <div class="mt-4">
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="top-container">
      <div class="container">
        <TreeView :userDetails="userDetails" />
        <EditorView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '../utils/api';
import TreeView from './TreeView.vue';
import EditorView from './EditorView.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { eventBus } from '../utils/eventBus';

type folderStructureType = {
  id: number,
  name: string,
  snippets: {
    id: number,
    content: string,
    fileName: string
  }[],
  children: folderStructureType[]
}

type UserDetailsType = {
  userEmail: string,
  userName: string,
  folderStructure: folderStructureType[]
}

// user details
const userDetails = ref<UserDetailsType>({} as UserDetailsType);
// other
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

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

const refreshData = async () => {
  await fetchUserDetail();
};

onMounted(async () => {
  eventBus.on('refreshData', refreshData);
  loading.value = true;
  await fetchUserDetail();
  loading.value = false;
});

onUnmounted(() => {
  eventBus.off('refreshData', refreshData);
});
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  gap: 16px;
}
</style>
