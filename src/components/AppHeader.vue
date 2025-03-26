<template>
  <header>
    <nav>
      <div class="logo"><a href="/" style="text-decoration: none; color: white;">Snipper</a></div>
      <div class="nav-links">
        <ButtonTag rounded @click="router.push('/'); console.log(store.isAuthenticated)" class="btn logout-btn"
          label="Home" severity="secondary" variant="text">
        </ButtonTag>
        <ButtonTag v-if="store.isAuthenticated" rounded @click="toLogout" class="btn logout-btn" label="Logout"
          severity="secondary" variant="text">
        </ButtonTag>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import api from '../utils/api';
import useUserStateStore from '../stores/userStateStore';

const store = useUserStateStore();
const router = useRouter();
const toLogout = async () => {
  await api.post('/logout');
  localStorage.removeItem('accessToken');
  store.updateAuthStatus(false);
  router.push('/');
};
</script>

<style scoped>
header {
  background-color: black;
  padding: 1rem;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 75%;
  margin: 0 auto;
}

.logo {
  font-family: "Bowlby One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 2rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
</style>
