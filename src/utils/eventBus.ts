import mitt from 'mitt';

type Events = {
	refreshData: void;
};

export const eventBus = mitt<Events>();
