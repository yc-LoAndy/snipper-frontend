import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Tree from 'primevue/tree';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import Dialog from 'primevue/dialog';
// for Toast
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
// for vue-codemirror
import { basicSetup } from 'codemirror';
import VueCodemirror from 'vue-codemirror';

import vue3GoogleLogin from 'vue3-google-login';

import App from './App.vue';
import router from './router';
import './style/style.css';
import 'primeicons/primeicons.css';
import env from './utils/env';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(
	PrimeVue, {
		theme: { preset: Aura }
	}
);
app.component('TreeTag', Tree);
app.component('InputText', InputText);
app.component('ButtonTag', Button);
app.component('FloatLabel', FloatLabel);
app.component('DialogTag', Dialog);
app.component('ToastTag', Toast);

app.use(ToastService);
app.use(VueCodemirror, {
	tabSize: 4,
	placeholder: '/* Your code... */',
	extensions: [basicSetup]
});

app.use(vue3GoogleLogin, { clientId: env.get('VITE_CLIENT_ID') });

app.use(router).mount('#app');
