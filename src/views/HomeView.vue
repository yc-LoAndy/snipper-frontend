<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card mt-5 black-background">
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-success w-50 mt-3">Login</button>
            </form>
            <div class="text-center mt-5">
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
    router.push('/editor');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
a {
  color: #7fd1d1;
}

button {
  color: #000;
  background-color: #6e9494;
  border: #6e9494;
}

button:hover {
  color: #000;
  background-color: #7fd1d1;
  border: #7fd1d1;
}

.black-background {
  background-color: #0f0e0e;
  color: #d9e2eb;
}

input {
  background-color: #babbbd;
  height: 5%;
}
</style>
