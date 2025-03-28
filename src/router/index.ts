import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MainView from '../views/MainView.vue';
import userStateStore from '../stores/userStateStore';
import TestView from '../views/TestView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
	{
		path: '/main',
		name: 'main',
		component: MainView
	},
	{
		path: '/test',
		name: 'test',
		component: TestView
	}
  ],
});


router.beforeEach(async (_, __, next) => {
	userStateStore().updateLoadingStatus(true);
	next();
});
router.afterEach(() => {
	const store = userStateStore();
	store.updateAuthStatus(!!localStorage.getItem('accessToken'));
	store.updateLoadingStatus(false);
});

export default router;
