<template>
  <header>
    <nav>
      <div class="d-flex" style="margin-left: 75px;">
        <div class="d-flex align-items-center pb-1">
          <img src="/logo.png" width="30" height="30">
        </div>
        <div class="mx-1"></div>
        <div class="logo"><a @click="router.push('/')">Snipper</a></div>
      </div>
      <div class="nav-links" style="margin-right: 35px;">
        <ButtonTag rounded @click="router.push('/');" label="Home" severity="secondary" variant="text" />
        <span v-if="store.isAuthenticated" class="separator"></span>
        <div v-if="store.isAuthenticated">
          <SplitButton rounded :model="userButtons" class="user-btn" severity="secondary" variant="text"
            @click="console.log(store.userDetails)">
            <img :src="store.userDetails?.userAvatarUrl ?? ''" width="30px" style="border-radius: 20px;">
            {{ store.userDetails?.userName ?? '' }}
          </SplitButton>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '../utils/api';
import useUserStateStore from '../stores/userStateStore';
import SplitButton from 'primevue/splitbutton';
import type { MenuItem } from 'primevue/menuitem';


const toast = useToast();
const store = useUserStateStore();
const router = useRouter();
const toLogout = async () => {
  await api.post('/logout');
  localStorage.removeItem('accessToken');
  store.updateAuthStatus(false);
  router.push('/');
  toast.add({
    severity: 'secondary',
    summary: 'Success',
    detail: 'Logout success',
    life: 5000
  });
};

const userButtons: MenuItem[] = [
  {
    label: 'Snippets',
    icon: 'pi pi-code',
    command: () => router.push('/main')
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: toLogout
  }
];

</script>

<style scoped>
header {
  background-color: 0f0f0f;
  padding: 1rem;
}

a {
  cursor: pointer;
  text-decoration: none;
  color: white;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 75%;
  margin: 0 auto;
}

.separator {
  margin-top: 2px;
  width: 1.5px;
  height: 20px;
  background: grey;
}

.user-btn {
  --p-button-secondary-background: transparent;
  --p-button-secondary-border-color: transparent;
  --p-button-secondary-color: #64748b;
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
