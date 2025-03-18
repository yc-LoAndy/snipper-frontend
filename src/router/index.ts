import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignUpView from '../views/SignUpView.vue';
import EditorView from '../views/EditorView.vue';

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
		path: '/editor',
		name: 'editor',
		component: EditorView
	}
  ],
});

export default router;
