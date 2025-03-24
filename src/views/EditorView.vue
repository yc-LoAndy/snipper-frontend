<template>
  <ConfirmDialog ref="confirmDialogRef" />
  <ErrorDialog ref="errorDialogRef" />
  <div class="content-container">
    <div class="file-path-container">

      <InputText :readonly="!isEditing" type="text" v-model="sharedState.currentFilePath"
        placeholder="Current file path" :style="pathInputStyle" ref="filePathInputRef" @keydown.enter="saveEdit" />

      <div v-if="!isEditing">
        <ButtonTag rounded class="toolbar-btns" severity="primary" variant="text" icon="pi pi-plus" label="Create"
          @click="startCreatingFile" />
        <ButtonTag rounded class="toolbar-btns" severity="info" variant="text" icon="pi pi-file-edit" label="Modify"
          :disabled="btnDisableToggle" @click="startUpdatingFile" />
        <ButtonTag rounded class="toolbar-btns" severity="danger" variant="text" icon="pi pi-file-edit" label="Delete"
          :disabled="btnDisableToggle" @click="onDelete" />
      </div>
      <div v-else class="edit-actions">
        <ButtonTag icon="pi pi-check" severity="secondary" rounded size="small" @click="saveEdit" />
        <ButtonTag icon="pi pi-times" severity="danger" rounded size="small" @click="cancelEdit" />
      </div>

    </div>
    <TextArea :readonly="!isCreatingNewFile && !isUpdatingFile" class="h-75" v-model="sharedState.currentEditorContent"
      placeholder="/* Your code here */" name="text-area" id="text-area" ref="editorRef" :style="editorBorderStyle">
    </TextArea>
  </div>
</template>

<script setup lang="ts">
import api from '../utils/api';
import { ref, computed, nextTick } from 'vue';
import { useToast } from 'primevue/usetoast';
import { eventBus } from '../utils/eventBus';
import ErrorDialog from '../components/ErrorDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import useSharedStore from '../stores/store';

const toast = useToast();
const store = useSharedStore();
const sharedState = store.$state;
// flags
const isCreatingNewFile = ref(false);
const isUpdatingFile = ref<boolean>(false);
const isRenamingFolder = ref(false);
const isEditing = computed(
  () => isUpdatingFile.value || isCreatingNewFile.value || isRenamingFolder.value);

let prevFilePath = '';
let prevEditorContent = '';
// refs
const editorRef = ref();
const filePathInputRef = ref();
const errorDialogRef = ref<InstanceType<typeof ErrorDialog> | null>(null);
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);

function resetView() {
  store.updateEditorContent('');
  store.updateCurrentNode(null);
  prevFilePath = '';
  prevEditorContent = '';
}

// obvious style when entering editing
const pathInputStyle = computed(() => isEditing.value
  ? {
    'width': sharedState.currentFilePath ? `${sharedState.currentFilePath.length + 5}ch` : '',
    '--p-inputtext-border-color': 'white',
    'color': 'white',
    'font-weight': '700'
  } : {
    'width': sharedState.currentFilePath ? `${sharedState.currentFilePath.length + 5}ch` : '',
    '--p-inputtext-border-color': '#0f0e0e',
    'color': '#a7a4a4',
    'font-weight': 'normal'
  }
);
const editorBorderStyle = computed(() => isEditing.value
  ? {
    '--p-textarea-border-color': '#b818b8',
    '--p-textarea-hover-border-color': '#d62bd6',
    '--p-textarea-focus-border-color': '#800080'
  }
  : {
    '--p-textarea-border-color': 'white',
  }
);

const btnDisableToggle = computed(
  () => sharedState.currentFilePath ? false : true
);

// after pushing create button
const startCreatingFile = () => {
  prevFilePath = sharedState.currentFilePath;
  prevEditorContent = sharedState.currentEditorContent;
  sharedState.currentEditorContent = '';
  isCreatingNewFile.value = true;
  filePathInputRef.value.$el.placeholder = '';

  if (sharedState.currentNode?.key.startsWith('snippet')) {
    const indexOfLastSlash = sharedState.currentFilePath.lastIndexOf('/');
    sharedState.currentFilePath = sharedState.currentFilePath.substring(0, indexOfLastSlash + 1);
  }
  else {
    sharedState.currentFilePath += '/';
  }

  nextTick(() => editorRef.value.$el.focus());
};

// after pushing modify button
const startUpdatingFile = () => {
  if (sharedState.currentNode?.key.startsWith('snippet')) {
    isUpdatingFile.value = true;
    nextTick(() => editorRef.value.$el.focus());
  }
  else if (sharedState.currentNode?.key.startsWith('folder')) {
    isRenamingFolder.value = true;
    nextTick(() => filePathInputRef.value.$el.focus());
  }
};

// canceling edit
const cancelEdit = () => {
  sharedState.currentFilePath = prevFilePath;
  sharedState.currentEditorContent = prevEditorContent;
  filePathInputRef.value.$el.placeholder = 'Current file path';
  isUpdatingFile.value = false;
  isCreatingNewFile.value = false;
  isRenamingFolder.value = false;
};

// confim editing
const saveEdit = async () => {
  if (!sharedState.currentFilePath || sharedState.currentFilePath.endsWith('/')) {
    errorDialogRef.value?.showError('Invalid path', 'Please provide a correct path.');
    return;
  }

  async function saveEditTemplate(
    url: string, method: string, data: Record<string, string>, expResStatus: number, toastDetail: string
  ) {
    try {
      const response = await api.request({ method, url, data, withCredentials: true });
      if (response.status === expResStatus) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: toastDetail,
          life: 5000
        });
        return response.data;
      }
    }
    catch {
      resetView();
    }
    return undefined;
  }

  if (isCreatingNewFile.value) {
    isCreatingNewFile.value = false;
    const responseData = await saveEditTemplate('/snippet', 'post', {
      filePath: sharedState.currentFilePath,
      content: sharedState.currentEditorContent
    }, 201, 'Snippet created');
    store.updateNewFileKey(`snippet-${responseData.snippetId}`);
  }
  else if (isUpdatingFile.value && sharedState.currentNode) {
    isUpdatingFile.value = false;
    await saveEditTemplate(`snippet/${sharedState.currentNode.key.replace('snippet-', '')}`, 'put', {
      newContent: sharedState.currentEditorContent,
      newPath: sharedState.currentFilePath
    }, 200, 'Snippet updated');
  }
  else if (isRenamingFolder.value && sharedState.currentNode) {
    isRenamingFolder.value = false;
    await saveEditTemplate(`/folder/${sharedState.currentNode.key.replace('folder-', '')}`, 'put', {
      newFolderPath: sharedState.currentFilePath
    }, 200, 'Folder updated');
  }
  eventBus.emit('refreshData');
};

const onDelete = async () => {
  if (!confirmDialogRef.value || !sharedState.currentNode) return;

  const obj = sharedState.currentNode.key.startsWith('folder') ? 'folder' : 'snippet';
  const userConfirmed = await confirmDialogRef.value.confirm(
    `Delete ${obj}`,
    `Are you sure you want to delete this ${obj}?${obj === 'folder' ? ' All contents will be deleted.' : ''}`
  );
  if (userConfirmed) {
    try {
      await api.delete(
        `/${obj}/${sharedState.currentNode.key.replace(`${obj}-`, '')}`, { withCredentials: true }
      );
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `${obj} deleted.`,
        life: 5000
      });
    }
    catch {
      resetView();
    }
    eventBus.emit('refreshData');
  }
  resetView();
};
</script>

<style scoped>
TextArea {
  color: #d9e2eb;
  background-color: #0f0e0e;
  resize: none;
  padding: 15px;
  font-family: "Courier Prime", monospace;
  font-weight: 400;
  font-style: normal;
}

.p-textarea {
  --p-textarea-focus-border-color: white;
  --p-textarea-border-radius: 10px;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-path-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.toolbar-btns {
  font-size: 14px;
}

.p-inputtext {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 8px;
  font-size: 14px;
  background-color: #0f0e0e;
}

.p-inputtext:focus {
  --p-inputtext-focus-border-color: #6e9494
}

.edit-actions {
  display: flex;
  gap: 4px;
}
</style>
