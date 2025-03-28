import { TreeNode } from 'primevue/treenode';

declare global {
	type folderStructureType = {
		id: number
		name: string
		snippets: {
			id: number
			content: string
			fileName: string
		}[],
		children: folderStructureType[]
	}
	
	type UserDetailsType = {
		userName: string
		userEmail: string
		userAvatarUrl: string
		folderStructure: folderStructureType[]
	}
	
	type EditorState = {
		currentNode: TreeNode | null
		currentFilePath: string
		currentEditorContent: string
		newFileKeys: string[]
		currentExpandedKeys: Record<string, boolean>
	}

	type UserState = {
		isAuthenticated: boolean
		userDetails: UserDetailsType | null
		isLoading: boolean
	}
}
