<template>
  <div class="container">
    <div class="row" style="display:flex; justify-content: center;">
      <div class="col-md-4">
        <div class="mt-5">
          <div class="logo">Snipper</div>
          <div class="mb-5 logo-description">
            <p>- Code Snippet Manager -</p>
          </div>
          <div>
            <Form @submit="handleSubmit">
              <div class="mb-3">
                <FloatLabel variant="on">
                  <InputText type="email" id="email" v-model="email" required />
                  <label for="email">Email</label>
                </FloatLabel>
              </div>
              <div class="mb-3">
                <FloatLabel variant="on">
                  <InputText type="password" id="password" v-model="password" required />
                  <label for="password">Password</label>
                </FloatLabel>
              </div>
              <div style="display:flex; justify-content: center;">
                <button rounded type="submit" class="login-button mt-2">Login</button>
              </div>
            </Form>
            <div style="display:flex; justify-content: center;" class="mt-3">
              <a href="/signup">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../utils/api';
import type { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { Form } from '@primevue/forms';
import useUserStateStore from '../stores/userStateStore';

const email = ref('');
const password = ref('');
const router = useRouter();
const store = useUserStateStore();

const handleSubmit = async () => {
  try {
    const response = await api.post(
      '/login',
      { userEmail: email.value, userPassword: password.value },
      // do not try to refresh tokens when login with email and pwd 
      { skipAuthRefresh: true } as AxiosAuthRefreshRequestConfig
    );
    const accessToken = response.data.accessToken;
    localStorage.setItem('accessToken', accessToken);
    store.updateAuthStatus(true);

    // Redirect to another page after successful login
    router.push('/main');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
.logo {
  text-align: center;
  font-family: "Bowlby One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 4rem;
}

.logo-description {
  text-align: center;
}

a {
  color: #a7a4a4;
}

.login-button {
  width: 40%;
  color: white;
  font-weight: bold;
  font-size: 18px;
  background: radial-gradient(134% 244% at 42% -80%, rgb(58, 150, 184) 15%, rgb(54, 19, 158) 100%);
  border: none;
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  padding: 10px;
}

.login-button:hover {
  opacity: 0.9;
  transform: scale(1.03);
}

.p-inputtext {
  width: 100%;
  --p-inputtext-color: #a7a4a4;
  --p-inputtext-background: #0f0f0f;
  --p-inputtext-filled-background: #0f0f0f;
  --p-inputtext-filled-focus-background: #0f0f0f;
  --p-inputtext-focus-border-color: rgb(49, 115, 168);
}

.p-floatlabel {
  --p-floatlabel-focus-color: #babbbd;
  --p-floatlabel-on-active-background: #0f0e0e;
}
</style>
