import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/SignInView.vue';
import MainView from '../views/MainView.vue';
import userStateStore from '../stores/userStateStore';

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
