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
        <div style="width: 100%;">
          <Splitter>
            <SplitterPanel :size="5" :minSize="20">
              <TreeView style="width: 100%; height: 100%;" />
            </SplitterPanel>
            <SplitterPanel :size="60" :minSize="40" style="width: 100%; height: 100%; margin-left: 7px;">
              <EditorView />
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '../utils/api';
import TreeView from './TreeView.vue';
import EditorView from './EditorView.vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { ref, onMounted, onUnmounted } from 'vue';
import { eventBus } from '../utils/eventBus';
import useSharedStore from '../stores/store';

// shared objects
const store = useSharedStore();
// others
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const fetchUserDetail = async () => {
  try {
    const response = await api.get('/user');
    store.updateUserDetail(response.data);
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

.p-splitter {
  --p-splitter-background: #0f0e0e;
  --p-splitter-gutter-background: #353434;
  --p-splitter-handle-background: #767575;
  --p-splitter-border-color: #0f0e0e;
}
</style>
