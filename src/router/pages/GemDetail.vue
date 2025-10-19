<template>
  <div class="bg-gray-100 text-black min-h-screen">
    <section class="max-w-6xl mx-auto px-6 pt-5 pb-12">
      <router-link
          to="/products"
          class="flex items-center text-emerald-600 hover:text-emerald-800 w-fit mb-4"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-5 h-5 mr-2"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </router-link>

      <h1 class="text-3xl font-bold text-center mb-8">
        {{ safeGem.name }}
      </h1>

      <div class="grid md:grid-cols-5 gap-8">
        <div class="md:col-span-2 flex flex-col items-center relative">
          <div class="relative w-full max-w-md aspect-square bg-gray-200 rounded-lg shadow-lg">

            <template v-if="activeMediaItem">
              <img
                  v-if="activeMediaItem.type === 'image'"
                  :src="activeMediaItem.url"
                  :alt="`${safeGem.name} image ${activeIndex + 1}`"
                  class="w-full h-full rounded-lg object-cover transition-all duration-300"
              />
              <video
                  v-else-if="activeMediaItem.type === 'video'"
                  :src="activeMediaItem.url"
                  :key="activeMediaItem.url"
                  class="w-full h-full rounded-lg object-cover"
                  controls
                  autoplay
                  muted
                  loop
                  playsinline
              ></video>
            </template>
            <img
                v-else-if="!hasMedia && safeGem.image"
                :src="safeGem.image"
                :alt="safeGem.name"
                class="w-full h-full rounded-lg object-cover"
            />
            <div
                v-else-if="!hasMedia"
                class="w-full h-full rounded-lg shadow-lg animate-pulse"
            ></div>

            <button
                v-if="hasMedia && allMedia.length > 1"
                @click="prevMedia"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
                v-if="hasMedia && allMedia.length > 1"
                @click="nextMedia"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div
              v-if="hasMedia && allMedia.length > 1"
              class="flex gap-2 mt-4 flex-wrap justify-center"
          >
            <div
                v-for="(media, idx) in allMedia"
                :key="media.url"
                class="w-16 h-16 rounded-lg cursor-pointer border-2 bg-gray-200"
                :class="idx === activeIndex ? 'border-emerald-600' : 'border-transparent opacity-80 hover:opacity-100'"
                @click="activeIndex = idx"
            >
              <img
                  v-if="media.type === 'image'"
                  :src="media.url"
                  :alt="`${safeGem.name} thumb ${idx + 1}`"
                  class="w-full h-full object-cover rounded"
              />
              <video
                  v-else-if="media.type === 'video'"
                  :src="media.url"
                  :alt="`${safeGem.name} thumb ${idx + 1}`"
                  class="w-full h-full object-cover rounded"
                  muted
                  playsinline
              ></video>
            </div>
          </div>
        </div>

        <div class="md:col-span-3 space-y-4">
          <div class="text-base leading-relaxed pt-4 border-t">
            <p class="mb-4">{{ safeGem.description }}</p>
            <ul class="space-y-2 text-gray-700">
              <li v-if="safeGem.status"><b>Status:</b> {{ safeGem.status }}</li>
              <li v-if="safeGem.origin"><b>Origin:</b> {{ safeGem.origin }}</li>
              <li v-if="safeGem.weight"><b>Weight:</b> {{ safeGem.weight }}</li>
              <li v-if="safeGem.dimensions"><b>Dimensions:</b> {{ safeGem.dimensions }}</li>
              <li v-if="safeGem.treatment"><b>Treatment:</b> {{ safeGem.treatment }}</li>
              <li v-if="safeGem.clarity"><b>Clarity:</b> {{ safeGem.clarity }}</li>
              <li v-if="safeGem.cut"><b>Cut:</b> {{ safeGem.cut }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="relatedGems.length > 0" class="mt-20">
        <h2 class="text-2xl font-bold text-center mb-8">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GemCard v-for="related in relatedGems" :key="related.id" :gem="related" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import GemCard from "../../components/GemCard.vue";
import type { Gem } from "../../models/Gem.ts";
import { fetchGems, fetchGemById } from "../../gem.ts";

const route = useRoute();
const gem = ref<Gem | null>(null);
const relatedGems = ref<Gem[]>([]);

// ----- NOVÁ LOGIKA KARUSELU -----

const activeIndex = ref(0);

// Vytvoříme jedno pole pro všechna média (obrázky i videa)
const allMedia = computed(() => {
  const images = (safeGem.value.images || []).map(url => ({ type: 'image' as const, url }));
  const videos = (safeGem.value.videos || []).map(url => ({ type: 'video' as const, url }));
  return [...images, ...videos];
});

// Zjistíme, zda máme nějaká média
const hasMedia = computed(() => allMedia.value.length > 0);

// Aktivní médium, které se má zobrazit
const activeMediaItem = computed(() => {
  if (!hasMedia.value) return null;
  return allMedia.value[activeIndex.value];
});

// Funkce pro listování (přejmenováno z Image na Media)
const nextMedia = () => {
  if (!hasMedia.value) return;
  activeIndex.value = (activeIndex.value + 1) % allMedia.value.length;
};

const prevMedia = () => {
  if (!hasMedia.value) return;
  activeIndex.value =
      (activeIndex.value - 1 + allMedia.value.length) % allMedia.value.length;
};

// ----- KONEC LOGIKY KARUSELU -----


// Načtení dat
const loadGem = async (id: string) => {
  try {
    const data = await fetchGemById(id);
    if (!data) throw new Error("Gem not found!");
    gem.value = data;

    const all = await fetchGems();
    relatedGems.value = all.filter((g) => g.id !== id).slice(0, 3);
    activeIndex.value = 0; // Reset karuselu
  } catch (err) {
    console.error("Error fetching gem:", err);
  }
};

onMounted(() => {
  if (route.params.id) {
    loadGem(route.params.id as string);
  }
});

watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        loadGem(newId as string);
        window.scrollTo(0, 0);
      }
    }
);

// Bezpečná verze 'gem' pro template, aby nepadal, než se data načtou
// Důležité: Přidáno 'videos: []'
const safeGem = computed<Gem>(() => gem.value || {
  id: "",
  name: "Načítání...",
  description: "",
  image: "",
  images: [],
  videos: [], // <-- PŘIDÁNO ZDE
  price: 0,
  isNew: false,
});
</script>

<style scoped>
/* Přidání poměru stran pro hlavní media kontejner */
.aspect-square {
  aspect-ratio: 1 / 1;
}

img, video {
  transition: opacity 0.3s ease;
}
</style>