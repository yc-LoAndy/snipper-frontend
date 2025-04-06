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
      <div class="d-flex justify-content-center middle-area">
        <div class="m-5 align-self-start middle-content">
          <div ref="slideDivRef" class="slide-in">
            Store your code snippets,<br>
            Reuse them whenever you want.
          </div>
          <div class="d-flex flex-column align-items-center">
            <div class="d-flex justify-content-center w-100 carousel-heads">
              <div class="d-flex align-items-center">
                <InputText readonly="true" type="text" :value="homeEditorTitle" placeholder="Current file path"
                  class="code-title" style="margin: auto;" />
              </div>
              <div class="d-flex align-items-center slide-button">
                <ButtonTag v-if="playInerval !== 0" @click="playInerval = 0" rounded icon="pi pi-pause" variant="text"
                  aria-label="Filter" severity="secondary" label="Pause" />
                <ButtonTag v-else @click="playInerval = 7000" rounded icon="pi pi-play" variant="text"
                  aria-label="Filter" severity="secondary" label="Continue" />
              </div>
            </div>
            <div class="w-100 carousal-div">
              <Carousel :autoplay="playInerval" v-model="sampleCodeIdx" :wrap-around="true"
                :pause-autoplay-on-hover="true">
                <Slide v-for="sampleCode in sampleCodes" :key="sampleCode.name">
                  <div class="carousel__item w-75 ">
                    <codemirror :modelValue="sampleCode.code" :extensions="getExtension(sampleCode.name)" />
                  </div>
                </Slide>
                <template #addons>
                  <Navigation style="color: white;" />
                  <Pagination style="--vc-pgn-active-color: white; --vc-pgn-background-color: gray" />
                </template>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="d-flex flex-column align-items-center">
          <div class="m-5 support-lang-div">Supported Language Syntax Highlight</div>
          <div class="d-flex justify-content-around align-items-center supported-langs">
            <div class="d-flex align-items-center support-lang" v-for="lang in shownLanguages" :key="lang">
              <img :src="`languageLogos/${lang.toLowerCase()}.png`" class="langs-logo">
              <div class="p-3">{{ lang }}</div>
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
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import 'vue3-carousel/carousel.css';
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
  sessionStorage.setItem('accessToken', backendResponse.data.accessToken);
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
  'Javascript', 'Cpp', 'Python', 'SQL'
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

@media only screen and (max-width: 600px) {
  .logo {
    font-size: 2.5rem;
  }

  .cursor {
    width: 4px;
    height: 32px;
    margin-bottom: 15px;
  }

  .logo-description {
    font-size: 0.8rem;
  }
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

@media screen and (max-width: 500px) {
  .btn {
    font-size: 18px;
  }
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

.middle-area {
  background-color: #211f1f;
  height: fit-content;
}

.middle-content {
  width: 75%;
}

@media screen and (max-width: 500px) {
  .code-title {
    font-size: 15px;
  }

  .middle-content {
    width: 100%;
  }
}

.slide-in {
  opacity: 0;
  transform: translateX(-100px);
  transition: all 0.6s ease-out;
  padding: 20px;
  font-weight: bolder;
  font-size: 60px;
  margin-bottom: 4rem;
}

.slide-in.visible {
  opacity: 1;
  transform: translateX(0);
}

@media screen and (max-width: 500px) {
  .slide-in {
    font-size: 32px;
  }

  .carousel__item {
    font-size: 10px;
  }
}

.carousel-heads {
  gap: 10px;
  margin-bottom: 20px;
}

.support-lang-div {
  font-weight: bolder;
  font-size: 50px;
}

.langs-logo {
  width: 50px;
  height: 50px;
}

.supported-langs {
  font-size: 25px;
  font-weight: bold;
  flex-direction: row;
}

.support-lang {
  margin: 30px;
}

@media screen and (max-width: 500px) {
  .support-lang-div {
    font-size: 30px;
  }

  .langs-logo {
    width: 20px;
    height: 20px;
  }

  .supported-langs {
    font-size: 20px;
    flex-direction: column;
  }

  .support-lang {
    margin: 20px;
    flex-direction: column;
  }

  .carousal-div {
    --vc-nav-height: 0;
    --vc-nav-width: 0;
  }

  .carousel-heads {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }

  .slide-button {
    display: flex;
    align-items: center;
  }

  .p-button {
    font-size: 12px;
    --p-icon-size: 12px;
  }
}
</style>
