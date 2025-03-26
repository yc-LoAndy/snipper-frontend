import { eventBus } from '../utils/eventBus';
import { defineStore } from 'pinia';
import type { TreeNode } from 'primevue/treenode';
import { trimAny } from '../utils/util';

export default defineStore('useEditorStore', {
	state: (): EditorState => ({
		currentNode: null,
		currentFilePath: '',
		currentEditorContent: '',
		currentExpandedKeys: {},
		newFileKeys: []
	}),
	actions: {
		updateEditorContent(content: string) {
			this.currentEditorContent = content;
		},
		updateNewFileKeys(path: string) {
			if (path.length === 0)
				this.newFileKeys = [];
			else
				this.newFileKeys = trimAny(path, ['.', '/']).split('/');
		},
		updateCurrentNode(newNode: TreeNode | null) {
			this.currentNode = newNode;
			this.currentFilePath = newNode?.path ?? '';
			this.currentEditorContent = newNode?.data ?? '';
			eventBus.emit('treeGotFocus');
		},
		updateCurrentExpanedeKeys(value: Record<string, boolean>) {
			this.currentExpandedKeys = value;
		},
		addExpanedeKeys(key: string) {
			this.currentExpandedKeys[key] = true;
		}
	},
	getters: {
		getSelectedKey: (state): Record<string, boolean> => {
			return state.currentNode
			? { [state.currentNode.key]: true }
			: {};
		}
	}
});
