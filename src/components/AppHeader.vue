<template>
  <header>
    <nav>
      <div class="header-div">
        <div class="d-flex logo-div">
          <div class="d-flex align-items-center pb-1">
            <img src="/logo.png" class="logo-img">
          </div>
          <div class="mx-1"></div>
          <div class="logo"><a @click="router.push('/')">Snipper</a></div>
        </div>
        <div class="nav-links">
          <ButtonTag rounded @click="router.push('/');" label="Home" severity="secondary" variant="text" />
          <span v-if="userStore.isAuthenticated" class="separator"></span>
          <div v-if="userStore.isAuthenticated" class="buttons-div">
            <SplitButton rounded :model="userButtons" class="user-btn" severity="secondary" variant="text"
              @click="console.log(userStore.userDetails)">
              <img :src="userStore.userDetails?.userAvatarUrl ?? ''" class="user-avatar">
              <div class="username-div">{{ userStore.userDetails?.userName ?? '' }}</div>
            </SplitButton>
          </div>
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
import useEditorStore from '../stores/editorStore';
import SplitButton from 'primevue/splitbutton';
import type { MenuItem } from 'primevue/menuitem';


const toast = useToast();
const userStore = useUserStateStore();
const editorStore = useEditorStore();
const router = useRouter();
const toLogout = async () => {
  await api.post('/logout');
  sessionStorage.removeItem('accessToken');

  userStore.$reset();
  editorStore.$reset();

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

<style lang="scss" scoped>
.header-div {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

header {
  background-color: 0f0f0f;
  padding: 1rem;
  height: fit-content;
}

a {
  cursor: pointer;
  text-decoration: none;
  color: white;
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

.user-avatar {
  width: 30px;
  border-radius: 20px;
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

.logo-img {
  width: 30px;
  height: 30px;
}

@media screen and (max-width: 500px) {
  .logo {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-img {
    width: 20px;
    height: 20px;
  }

  .logo-div {
    margin-left: 0;
  }

  .p_splitbutton {
    width: 10px;
  }

  .username-div {
    display: none;
  }

  .p-button {
    font-size: 0.8rem;
    --p-button-padding-x: 6.5px;
    --p-button-padding-y: 6.5px;
  }

  .user-btn {
    --p-button-padding-x: 6px;
    --p-button-padding-y: 6px;
  }

  .separator {
    height: 15px;
  }

  .user-avatar {
    width: 25px;
  }

  .nav-links {
    gap: 0.5rem;
  }
}
</style>
