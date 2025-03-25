import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/SignInView.vue';
import SignUpView from '../views/SignUpView.vue';
import MainView from '../views/MainView.vue';

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

export default router;
