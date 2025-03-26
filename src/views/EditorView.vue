<template>
  <ConfirmDialog ref="confirmDialogRef" />
  <ErrorDialog ref="errorDialogRef" />
  <SettingDialog ref="settingDialogRef" @update:textSize="onUpdateTextSize" />
  <div>
    <div class="file-path-container">
      <div class="">
        <InputText :readonly="!isEditing" type="text" v-model="store.currentFilePath" placeholder="Current file path"
          :style="pathInputStyle" ref="filePathInputRef" @keydown.enter="saveEdit" />
      </div>

      <div v-if="!isEditing">
        <ButtonTag rounded class="toolbar-btns" severity="primary" variant="text" icon="pi pi-plus" label="Create"
          @click="startCreatingFile" />
        <ButtonTag rounded class="toolbar-btns" severity="info" variant="text" icon="pi pi-file-edit" label="Modify"
          :disabled="btnDisableToggle" @click="startUpdatingFile" />
        <ButtonTag rounded class="toolbar-btns" severity="danger" variant="text" icon="pi pi-file-edit" label="Delete"
          :disabled="btnDisableToggle" @click="onDelete" />
        <ButtonTag rounded class="toolbar-btns" severity="secondary" variant="text" icon="pi pi-cog"
          @click="settingDialogRef?.showSettings" />
      </div>
      <div v-else class="edit-actions">
        <ButtonTag icon="pi pi-check" severity="secondary" rounded size="small" @click="saveEdit" />
        <ButtonTag icon="pi pi-times" severity="danger" rounded size="small" @click="cancelEdit" />
      </div>

    </div>
    <div>
      <codemirror v-model="store.currentEditorContent" :disabled="!isCreatingNewFile && !isUpdatingFile"
        :extensions="cmExtensions" @ready="handleReady" style="height: 750px;"
        :style="{ 'font-size': `${13 + textSize * 0.15}px` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '../utils/api';
import { ref, shallowRef, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import SettingDialog from '../components/SettingDialog.vue';
import { eventBus } from '../utils/eventBus';
import ErrorDialog from '../components/ErrorDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import useEditorStore from '../stores/editorStore';
// for codemirror
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { css } from '@codemirror/lang-css';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { yaml } from '@codemirror/lang-yaml';
import { vue } from '@codemirror/lang-vue';
import { oneDark } from '@codemirror/theme-one-dark';
import { getFileExtension } from '../utils/util';
import type { TreeNode } from 'primevue/treenode';

const toast = useToast();
const store = useEditorStore();
// flags
const isCreatingNewFile = ref(false);
const isUpdatingFile = ref<boolean>(false);
const isRenamingFolder = ref(false);
const isEditing = computed(
  () => isUpdatingFile.value || isCreatingNewFile.value || isRenamingFolder.value);
let prevNode: TreeNode | null = null;
const textSize = ref(15);
// refs
const editorRef = shallowRef();
const filePathInputRef = ref();
const errorDialogRef = ref<InstanceType<typeof ErrorDialog> | null>(null);
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const settingDialogRef = ref<InstanceType<typeof SettingDialog> | null>(null);

const onUpdateTextSize = (v: number) => { textSize.value = v; };

const cmExtensions = computed(() => {
  const ext = [oneDark];
  const extMap = new Map([
    ['.js', javascript()],
    ['.html', html()],
    ['.json', json()],
    ['.py', python()],
    ['.css', css()],
    ['.cpp', cpp()],
    ['.java', java()],
    ['.md', markdown()],
    ['.sql', sql()],
    ['.yaml', yaml()],
    ['.yml', yaml()],
    ['.vue', vue()],
  ]);
  if (store.currentFilePath) {
    const fileExt = '.' + getFileExtension(store.currentFilePath);
    if (extMap.has(fileExt)) {
      ext.push(extMap.get(fileExt)!);
    }
  }
  return ext;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleReady = (payload: any) => {
  editorRef.value = payload.view;
};


function resetView() {
  store.updateEditorContent('');
  store.updateCurrentNode(null);
}

// obvious style when entering editing
const pathInputStyle = computed(() => isEditing.value
  ? {
    'width': store.currentFilePath ? `${store.currentFilePath.length + 5}ch` : '',
    '--p-inputtext-border-color': 'white',
    'color': 'white',
    'font-weight': '700'
  } : {
    'width': store.currentFilePath ? `${store.currentFilePath.length + 5}ch` : '',
    '--p-inputtext-border-color': '#0f0e0e',
    'color': '#a7a4a4',
    'font-weight': 'normal'
  }
);

const btnDisableToggle = computed(
  () => store.currentFilePath ? false : true
);

// after pushing create button
const startCreatingFile = () => {
  prevNode = store.currentNode;
  isCreatingNewFile.value = true;
  filePathInputRef.value.$el.placeholder = '';

  if (store.currentNode?.key.startsWith('snippet')) {
    const indexOfLastSlash = store.currentFilePath.lastIndexOf('/');
    store.currentFilePath = store.currentFilePath.substring(0, indexOfLastSlash + 1);
  }
  else {
    store.currentFilePath += '/';
  }

  store.updateEditorContent('');
  nextTick(() => editorRef.value.focus());
};

// after pushing modify button
const startUpdatingFile = () => {
  prevNode = store.currentNode;
  if (store.currentNode?.key.startsWith('snippet')) {
    isUpdatingFile.value = true;
    nextTick(() => editorRef.value.focus());
  }
  else if (store.currentNode?.key.startsWith('folder')) {
    isRenamingFolder.value = true;
    nextTick(() => filePathInputRef.value.$el.focus());
  }
};

// canceling edit
const cancelEdit = () => {
  filePathInputRef.value.$el.placeholder = 'Current file path';
  isUpdatingFile.value = isCreatingNewFile.value = isRenamingFolder.value = false;
  store.updateCurrentNode(prevNode);
};

// confim editing
const saveEdit = async () => {
  if (!store.currentFilePath || store.currentFilePath.endsWith('/')) {
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
      }
    }
    catch {
      resetView();
    }
  }

  if (isCreatingNewFile.value) {
    isCreatingNewFile.value = false;
    await saveEditTemplate('/snippet', 'post', {
      filePath: store.currentFilePath,
      content: store.currentEditorContent
    }, 201, 'Snippet created');
    store.updateNewFileKeys(store.currentFilePath);
  }
  else if (isUpdatingFile.value && store.currentNode) {
    isUpdatingFile.value = false;
    await saveEditTemplate(`snippet/${store.currentNode.key.replace('snippet-', '')}`, 'put', {
      newContent: store.currentEditorContent,
      newPath: store.currentFilePath
    }, 200, 'Snippet updated');
  }
  else if (isRenamingFolder.value && store.currentNode) {
    isRenamingFolder.value = false;
    await saveEditTemplate(`/folder/${store.currentNode.key.replace('folder-', '')}`, 'put', {
      newFolderPath: store.currentFilePath
    }, 200, 'Folder updated');
  }
  eventBus.emit('refreshData');
};

const onDelete = async () => {
  if (!confirmDialogRef.value || !store.currentNode) return;

  const obj = store.currentNode.key.startsWith('folder') ? 'folder' : 'snippet';
  const userConfirmed = await confirmDialogRef.value.confirm(
    `Delete ${obj}`,
    `Are you sure you want to delete this ${obj}?${obj === 'folder' ? ' All contents will be deleted.' : ''}`
  );
  if (userConfirmed) {
    try {
      await api.delete(
        `/${obj}/${store.currentNode.key.replace(`${obj}-`, '')}`, { withCredentials: true }
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


const whenTreeGotFocus = () => {
  isUpdatingFile.value = isCreatingNewFile.value = isRenamingFolder.value = false;
};
onMounted(() => {
  eventBus.on('treeGotFocus', whenTreeGotFocus);
});
onUnmounted(() => {
  eventBus.off('treeGotFocus', whenTreeGotFocus);
});
</script>

<style scoped>
.file-path-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
