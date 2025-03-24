import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Tree from 'primevue/tree';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import Dialog from 'primevue/dialog';
// for Toast
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import App from './App.vue';
import router from './router';
import './style/style.css';
import 'primeicons/primeicons.css';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(
	PrimeVue, {
		theme: { preset: Aura }
	}
);
app.component('TreeTag', Tree);
app.component('TextArea', Textarea);
app.component('InputText', InputText);
app.component('ButtonTag', Button);
app.component('FloatLabel', FloatLabel);
app.component('DialogTag', Dialog);
app.component('ToastTag', Toast);

app.use(ToastService);

app.use(router).mount('#app');
