<template>
  <div class="tree-container">
    <div class="greeting-container">
      <h4>Hi, {{ userName ?? userEmail ?? '' }}</h4>
    </div>
    <div>
      <TreeTag v-model:selectionKeys="selectedKey" :value="getTreeNodes" selection-mode="single"
        class="font-weight-bold" @node-select="onNodeSelect">
      </TreeTag>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { TreeNode } from 'primevue/treenode';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { PrimeIcons } from '@primevue/core/api';
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

// for tree node
const selectedKey = ref<{ [key: string]: boolean }>({});
// user details
const props = defineProps<{ userDetails: UserDetailsType }>();
const userName = computed(() => props.userDetails.userName);
const userEmail = computed(() => props.userDetails.userEmail);

const getTreeNodes = computed<TreeNode[]>(() => {
  const nodes: TreeNode[] = [];
  const rootFolders = props.userDetails.folderStructure;
  if (rootFolders.length === 0)
    return nodes;
  nodes.push(...(rootFolders.map<TreeNode>(
    (f) => ({
      key: 'folder-' + String(f.id),
      label: f.name,
      children: [],
      icon: PrimeIcons.FOLDER,
      path: '/' + f.name
    })
  )));

  function recursivePushNodes(f: folderStructureType, fnode: TreeNode) {
    for (const ch of f.children) {
      fnode.children!.push({
        key: 'folder-' + String(ch.id),
        label: ch.name,
        children: [],
        icon: PrimeIcons.FOLDER,
        path: fnode.path + '/' + ch.name
      });
    }

    if (f.snippets.length > 0) {
      f.snippets.forEach(
        (s) => {
          fnode.children!.push({
            key: 'snippet-' + String(s.id),
            label: s.fileName,
            data: s.content,
            icon: PrimeIcons.CODE,
            path: fnode.path + '/' + s.fileName
          });
        }
      );
    }

    for (let i = 0; i < f.children.length; i++) {
      recursivePushNodes(f.children[i], fnode.children![i]);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    recursivePushNodes(rootFolders[i], nodes[i]);
  }

  return nodes;
});

const onNodeSelect = (node: TreeNode) => {
  selectedKey.value = { [node.key]: true };
  eventBus.emit('currentFilePath', node.path);
  eventBus.emit('currentNodeId', node.key);
  eventBus.emit('editorContent', node.data);
};

const onSetSelectedKey = (key: string) => { selectedKey.value = { [key]: true }; console.log(selectedKey.value); };

onMounted(() => {
  eventBus.on('setSelectedKey', onSetSelectedKey);
});
onUnmounted(() => {
  eventBus.off('setSelectedKey', onSetSelectedKey);
});

</script>

<style scoped>
h4 {
  font-weight: 700;
}

.greeting-container {
  display: flex;
  justify-content: flex-start;
  margin-left: 35px;
}

.tree-container {
  background-color: #0f0e0e;
  padding-top: 8px;
  width: 30%;
  min-width: 250px;
  height: 75%;
  overflow-y: auto;
}

.p-tree {
  --p-tree-background: #0f0e0e;
  --p-tree-node-color: #d9e2eb;
  --p-tree-node-selected-background: #7fd1d1;
  --p-tree-node-selected-color: #0f0e0e;
  --p-tree-node-hover-background: #6e9494;
}

.p-tree-node-label {
  font-weight: 700 !important;
}
</style>
