import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/SignInView.vue';
import SignUpView from '../views/SignUpView.vue';
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
		path: '/signup',
		name: 'signup',
		component: SignUpView,
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
	userStateStore().updateLoadingStatus(false);
});

export default router;
