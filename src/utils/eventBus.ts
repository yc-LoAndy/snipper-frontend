import mitt from 'mitt';

type Events = {
	refreshData: void;
	treeGotFocus: void;
};

export const eventBus = mitt<Events>();
