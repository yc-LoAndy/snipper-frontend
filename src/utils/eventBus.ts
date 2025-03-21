import mitt from 'mitt';

type Events = {
	currentFilePath: string;
	editorContent: string;
	currentNodeId: string;
	refreshData: boolean;
	setSelectedKey: string
};

export const eventBus = mitt<Events>();
