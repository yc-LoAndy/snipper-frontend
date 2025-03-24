import { defineStore } from 'pinia';
import type { TreeNode } from 'primevue/treenode';

export default defineStore('shared', {
	state: (): SharedState => ({
		userDetails: null,
		currentNode: null,
		currentFilePath: '',
		currentEditorContent: '',
		newFileKey: null
	}),
	actions: {
		updateUserDetail(newUserDetails: UserDetailsType) {
			this.userDetails = newUserDetails;
		},
		updateEditorContent(content: string) {
			this.currentEditorContent = content;
		},
		updateNewFileKey(key: string | null) {
			this.newFileKey = key;
		},
		updateCurrentNode(newNode: TreeNode | null) {
			this.currentNode = newNode;
			this.currentFilePath = newNode?.path ?? '';
			this.currentEditorContent = newNode?.data ?? '';
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
