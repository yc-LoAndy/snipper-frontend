<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="mt-5">
          <div class="">
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
              <ButtonTag severity="secondary" size="small" type="submit" class="btn btn-success w-50 mt-3">Login
              </ButtonTag>
            </Form>
            <div class="text-center mt-3">
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

const email = ref('');
const password = ref('');
const router = useRouter();

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

    // Redirect to another page after successful login
    router.push('/main');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
a {
  color: #a7a4a4;
}

.p-button {
  font-weight: bold;
  --p-button-sm-font-size: 16px;
}

.p-inputtext {
  width: 100%;
  --p-inputtext-color: #a7a4a4;
  --p-inputtext-background: #0f0f0f;
  --p-inputtext-filled-background: #0f0f0f;
  --p-inputtext-filled-focus-background: #0f0f0f;
}

.p-floatlabel {
  --p-floatlabel-focus-color: #babbbd;
  --p-floatlabel-on-active-background: #0f0e0e;
}
</style>
