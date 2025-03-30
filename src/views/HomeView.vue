<template>
  <div class="mt-5" style="min-height: 2000px;">
    <BackView
      style="position: fixed; top: 0; left: 0%; width: 100%; height: 100%; z-index: -1; background-color: #0f0f0f;" />
    <div style="position: relative; z-index: 1;">
      <div class="d-flex justify-content-center">
        <div class="logo">
          <span>{{ logo }}</span><span class="cursor">&nbsp;</span>
        </div>
      </div>
      <div class="mb-5 logo-description">
        <p>- Code Snippet Manager -</p>
        <div class="d-flex justify-content-center m-5">
          <a class="btn btn-1">
            <svg @click="handleGoogleAccessTokenLogin">
              <rect x="0" y="0" fill="none" width="100%" height="100%" />
            </svg>
            Get Started
          </a>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center" style="background-color: #211f1f; height: 1250px;">
      <div class="w-75 m-5 align-self-start">
        <div style="font-weight: bolder; font-size: 60px; margin-bottom: 4rem;" ref="slideDivRef" class="slide-in">
          Store your code snippets,<br>
          Reuse them whenever you want.
        </div>
        <div class="d-flex flex-column align-items-center">
          <div class="d-flex justify-content-between w-100">
            <InputText readonly="true" type="text" :value="homeEditorTitle" placeholder="Current file path"
              class="mb-3 code-title" style="margin: auto;" />
            <div>
              <ButtonTag v-if="playInerval !== 0" @click="playInerval = 0" rounded icon="pi pi-pause" variant="text"
                aria-label="Filter" severity="secondary" label="Pause" />
              <ButtonTag v-else @click="playInerval = 7000" rounded icon="pi pi-play" variant="text" aria-label="Filter"
                severity="secondary" label="Continue" />
            </div>
          </div>
          <div class="w-100">
            <Carousel :autoplay="playInerval" v-model="sampleCodeIdx" :wrap-around="true"
              :pause-autoplay-on-hover="true">
              <Slide v-for="sampleCode in sampleCodes" :key="sampleCode.name">
                <div class="carousel__item w-75">
                  <codemirror :modelValue="sampleCode.code" :extensions="getExtension(sampleCode.name)"
                    style="width: 100%; height:auto;" />
                </div>
              </Slide>
              <template #addons>
                <Navigation style="--vc-nav-background: white; --vc-nav-border-radius:20px" />
                <Pagination style="--vc-pgn-active-color: white; --vc-pgn-background-color: gray" />
              </template>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="d-flex flex-column align-items-center">
        <div class="m-5" style="font-weight: bolder; font-size: 50px;">Supported Language Syntax Highlight</div>
        <div class="d-flex justify-content-around align-items-center">
          <div class="d-flex m-5 align-items-center" v-for="lang in shownLanguages" :key="lang">
            <img :src="`languageLogos/${lang.toLowerCase()}.png`" :width="lang === 'Markdown' ? '75px' : '50px'"
              height="50px">
            <div class="p-3" style="font-size: 25px;">{{ lang }}</div>
          </div>
          <div class="p-3" style="font-size: 25px; font-weight: bolder;">... and more</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { getExtension } from '../utils/syntaxSupport';
import { useRouter } from 'vue-router';
import { googleTokenLogin } from 'vue3-google-login';
import api from '../utils/api';
import env from '../utils/env';
import 'vue3-carousel/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import BackView from './BackView.vue';
import useUserStateStore from '../stores/userStateStore';
import useEditorStore from '../stores/editorStore';

const userStore = useUserStateStore();
const editorStore = useEditorStore();

const sampleCodes = ref<{ name: string, code: string }[]>([]);
const homeEditorTitle = ref('');
const sampleCodeIdx = ref(0);

const router = useRouter();
const handleGoogleAccessTokenLogin = async () => {
  const response = await googleTokenLogin({
    clientId: env.get('VITE_CLIENT_ID')
  });
  const googleAccessToken = response.access_token;
  const backendResponse = await api.post('/google/callback', { accessToken: googleAccessToken });
  localStorage.setItem('accessToken', backendResponse.data.accessToken);
  userStore.$reset();
  editorStore.$reset();
  router.push('/main');
};

const getExampleCodes = async () => {
  const response = await api.get('/example');
  sampleCodes.value = response.data;
  sampleCodeIdx.value = 0;
  homeEditorTitle.value = sampleCodes.value[0]?.name ?? '';
};

const playInerval = ref(5000);

watch(
  sampleCodeIdx,
  (newIdx) => {
    homeEditorTitle.value = sampleCodes.value[newIdx]?.name ?? '';
  }
);

const shownLanguages = [
  'Javascript', 'Cpp', 'Python', 'SQL', 'Markdown'
];

const slideDivRef = ref(null);
const logoText = 'Snipper';
const logo = ref(logoText[0]);

onMounted(async () => {
  await getExampleCodes();
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
      else {
        entry.target.classList.remove('visible');
      }
    },
    { threshold: 0.7 }
  );
  if (slideDivRef.value) {
    observer.observe(slideDivRef.value);
  }

  let index = 1;
  const interval = setInterval(() => {
    logo.value += logoText[index];
    index++;
    if (index === logoText.length) {
      clearInterval(interval);
    }
  }, 300); // Adjust typing speed (100ms here)
});
</script>

<style lang="scss" scoped>
.cursor {
  display: inline-block;
  width: 16px;
  height: 90px;
  background-color: #d9e2eb;
  animation: blink 0.9s step-end infinite;
  position: absolute;
  right: -10;
  margin-top: 15px;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.logo {
  text-align: center;
  font-family: "Bowlby One", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 6rem;
  display: inline-block;
  position: relative;
}

.logo-description {
  text-align: center;
  font-size: 1.2rem;
}

.code-title {
  color: white;
  font-size: 20px;
  text-align: center;
  background-color: #2c2c2c;
  border-radius: 20px;
  border-color: grey;
  border-width: 2px;
  --p-inputtext-focus-border-color: rgb(24, 78, 93);
}

.sample-code-enter-active {
  transform: translateX(100px);
}

.sample-code-leave-active {
  transform: translateX(-100px);
}

.sample-code-enter-from,
.sample-code-leave-to {
  opacity: 0;
}

.sample-code-enter-to,
.sample-code-leave-from {
  opacity: 1;
}

.btn {
  cursor: pointer;
  font-size: 20px;
  line-height: 45px;
  margin: 0 0 2em;
  max-width: 260px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
  padding: 5px 25px;
  border: none;
  box-shadow: 0 0 10px #908888;
}

.btn-1 {
  color: white;
  background: #292929;
  font-weight: 500;

  svg {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  rect {
    fill: none;
  }
}

.btn-1:hover {
  color: white;
  font-weight: 900;
  letter-spacing: 1px;
  animation: rainbow-shadow 3s infinite linear alternate;
}


@keyframes rainbow-shadow {
  0% {
    box-shadow: 0 0 10px red;
  }

  16% {
    box-shadow: 0 0 10px orange;
  }

  33% {
    box-shadow: 0 0 10px yellow;
  }

  50% {
    box-shadow: 0 0 10px green;
  }

  66% {
    box-shadow: 0 0 10px blue;
  }

  83% {
    box-shadow: 0 0 10px indigo;
  }

  100% {
    box-shadow: 0 0 10px violet;
  }
}

.slide-in {
  opacity: 0;
  transform: translateX(-100px);
  transition: all 0.6s ease-out;
  padding: 20px;
}

.slide-in.visible {
  opacity: 1;
  transform: translateX(0);
}
</style>
