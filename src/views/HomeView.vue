<template>
  <div class="container mt-5">
    <div class="logo">Snipper</div>
    <div class="mb-5 logo-description">
      <p>- Code Snippet Manager -</p>
    </div>
    <div class="d-flex justify-content-center">
      <!-- <GoogleLogin :callback="handleGoogleAccessTokenLogin" class="w-50 d-flex justify-content-center"> -->
      <button rounded type="button" class="login-button mt-2" @click="handleGoogleAccessTokenLogin">Get Started</button>
      <!-- </GoogleLogin> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { googleTokenLogin } from 'vue3-google-login';
import api from '../utils/api';
import env from '../utils/env';

const router = useRouter();
const handleGoogleAccessTokenLogin = async () => {
  const response = await googleTokenLogin({
    clientId: env.get('VITE_CLIENT_ID')
  });
  const googleAccessToken = response.access_token;
  await api.post('/google/callback', { accessToken: googleAccessToken });
  router.push('/main');
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
</style>
