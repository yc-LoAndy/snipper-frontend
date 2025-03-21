<template>
  <ErrorDialog ref="errorDialogRef" />
  <div class="content-container">
    <div class="file-path-container">

      <InputText :readonly="!isEditing" type="text" v-model="currentFilePath" placeholder="Current file path"
        :style="pathInputStyle" ref="filePathInputRef" @keydown.enter="saveEdit" />

      <div v-if="!isEditing">
        <ButtonTag rounded class="create-files-btn" severity="secondary" variant="text" icon="pi pi-plus" label="Create"
          @click="startCreatingFile" />
        <ButtonTag rounded class="create-files-btn" severity="secondary" variant="text" icon="pi pi-file-edit"
          label="Modify" :disabled="modifyBtnDisableSwitch" @click="startUpdatingFile" />
      </div>
      <div v-else class="edit-actions">
        <ButtonTag icon="pi pi-check" severity="secondary" rounded size="small" @click="saveEdit" />
        <ButtonTag icon="pi pi-times" severity="danger" rounded size="small" @click="cancelEdit" />
      </div>

    </div>
    <TextArea :readonly="!isCreatingNewFile && !isUpdatingFile" class="h-75" v-model="editorContent"
      placeholder="/* Your code here */" name="text-area" id="text-area" ref="editorRef" :style="editorBorderStyle">
    </TextArea>
  </div>
</template>

<script setup lang="ts">
import api from '../utils/api';
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { strCount } from '../utils/util';
import { useToast } from 'primevue/usetoast';
import { eventBus } from '../utils/eventBus';
import ErrorDialog from '../components/ErrorDialog .vue';

const toast = useToast();
// flags
const isCreatingNewFile = ref(false);
const isUpdatingFile = ref<boolean>(false);
const isEditing = computed(() => isUpdatingFile.value || isCreatingNewFile.value);
// watching objects
const currentFilePath = ref<string>('');
const editorContent = ref<string>('');
const currentNodeId = ref<string>('');
const prevFilePath = ref<string>('');
const prevEditorContent = ref<string>('');
// refs
const editorRef = ref();
const filePathInputRef = ref();
const errorDialogRef = ref<InstanceType<typeof ErrorDialog> | null>(null);
// emits
const emit = defineEmits(['confirmEdit']);


// obvious style when entering editing
const pathInputStyle = computed(() => isEditing.value
  ? {
    'width': currentFilePath.value ? `${currentFilePath.value.length + 5}ch` : '',
    '--p-inputtext-border-color': 'white',
    'color': 'white',
    'font-weight': '700'
  } : {
    'width': currentFilePath.value ? `${currentFilePath.value.length + 5}ch` : '',
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

// disable modify button when folder is chosen
const modifyBtnDisableSwitch = computed(() => currentNodeId.value.startsWith('folder') ? true : false);

// after pushing create button
const startCreatingFile = () => {
  prevFilePath.value = currentFilePath.value;
  prevEditorContent.value = editorContent.value;
  editorContent.value = '';
  isCreatingNewFile.value = true;
  filePathInputRef.value.$el.placeholder = '';

  if (currentFilePath.value) {
    if (strCount(currentFilePath.value, '/') !== 1) {
      const indexOfLastSlash = currentFilePath.value.lastIndexOf('/');
      currentFilePath.value = currentFilePath.value.substring(0, indexOfLastSlash + 1);
    }
    else {
      currentFilePath.value += '/';
    }
  }

  nextTick(() => editorRef.value.$el.focus());
};

// after pushing modify button
const startUpdatingFile = () => {
  isUpdatingFile.value = true;
  nextTick(() => editorRef.value.$el.focus());
};

// canceling edit
const cancelEdit = () => {
  currentFilePath.value = prevFilePath.value;
  editorContent.value = prevEditorContent.value;
  filePathInputRef.value.$el.placeholder = 'Current file path';
  isUpdatingFile.value = false;
  isCreatingNewFile.value = false;
};

// confim editing
const saveEdit = async () => {
  if (!currentFilePath.value || currentFilePath.value.endsWith('/')) {
    console.log(errorDialogRef.value === null);
    errorDialogRef.value?.showError('Invalid path', 'Please provide a correct path.');
  }
  else {
    if (isCreatingNewFile.value) {
      isCreatingNewFile.value = false;
      const response = await api.post('/snippet', {
        filePath: currentFilePath.value,
        content: editorContent.value ?? ''
      }, { withCredentials: true });
      if (response.status === 201)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Snippet created',
          life: 5000
        });
    }
    else if (isUpdatingFile.value) {
      isUpdatingFile.value = false;
      const response = await api.put(`snippet/${currentNodeId.value.replace('snippet-', '')}`, {
        newContent: editorContent.value,
        newPath: currentFilePath.value
      }, { withCredentials: true });
      if (response.status === 200) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Snippet updated',
          life: 5000
        });
      }
    }
  }
  emit('confirmEdit');
};

const updateCurrentFilePath = (p: string) => { currentFilePath.value = p; prevFilePath.value = p; };
const updateEditorContent = (c: string) => { editorContent.value = c; prevEditorContent.value = c; };
const updateCurrentNodeId = (i: string) => { currentNodeId.value = i; };
onMounted(() => {
  eventBus.on('currentFilePath', updateCurrentFilePath);
  eventBus.on('editorContent', updateEditorContent);
  eventBus.on('currentNodeId', updateCurrentNodeId);
});
onUnmounted(() => {
  eventBus.off('currentFilePath', updateCurrentFilePath);
  eventBus.off('editorContent', updateEditorContent);
  eventBus.off('currentNodeId', updateCurrentNodeId);
});
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

.create-files-btn {
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
