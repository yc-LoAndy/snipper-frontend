<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card mt-5 black-background">
          <div class="card-body">
            <h5 class="card-title text-center mb-4">Sign Up</h5>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" v-model="username" required>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" v-model="password" required>
              </div>
              <button type="submit" class="btn btn-success w-50 mt-3">Sign Up</button>
            </form>
            <div class="text-center mt-3">
              <a href="/">Already have an account? Login</a>
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
import api from '../utils/errorHandler';

const username = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const handleSubmit = async () => {
  try {
    const response = await api.post('/user', {
      userName: username.value,
      userEmail: email.value,
      password: password.value
    });
    // Handle successful signup, e.g., redirect to login or dashboard
    console.log("Signup successful:", response.data);
    router.push('/'); // Redirect to login page after successful signup
  } catch (error) {
    console.error('Signup failed:', error);
    // Handle signup errors, e.g., display error messages to the user
  }
};
</script>

<style scoped>
.black-background {
  background-color: #0f0e0e;
  color: #d9e2eb;
}

input {
  background-color: #babbbd;
  height: 5%;
}
</style>
