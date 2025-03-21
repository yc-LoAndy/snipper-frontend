import mitt from 'mitt';

type Events = {
	currentFilePath: string;
	editorContent: string;
	currentNodeId: string;
};

export const eventBus = mitt<Events>();
