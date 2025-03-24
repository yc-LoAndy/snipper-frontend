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
		userEmail: string
		userName: string
		folderStructure: folderStructureType[]
	}
	
	type SharedState = {
		userDetails: UserDetailsType | null
		currentNode: TreeNode | null
		currentFilePath: string
		currentEditorContent: string
		newFileKey: string | null
	}
}
