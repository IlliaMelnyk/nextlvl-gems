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
          <div class="relative w-full max-w-md bg-gray-200 rounded-lg shadow-lg aspect-square overflow-hidden">
            <template v-if="activeMediaItem">
              <img
                  v-if="activeMediaItem.type === 'image'"
                  :key="activeMediaItem.url"
                  :src="activeMediaItem.url + '?tr=f-auto'"
                  :alt="`${safeGem.name} image ${activeIndex + 1}`"
                  class="w-full h-full rounded-lg object-cover transition-opacity duration-300"
              />
              <iframe
                  v-else-if="activeMediaItem.type === 'vimeo' || activeMediaItem.type === 'youtube'"
                  :key="activeMediaItem.embedUrl"
                  :src="activeMediaItem.embedUrl"
                  class="absolute top-0 left-0 w-full h-full"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
              ></iframe>
              <video
                  v-else-if="activeMediaItem.type === 'file'"
                  :src="activeMediaItem.url"
                  :key="activeMediaItem.url"
                  class="w-full h-full rounded-lg object-cover"
                  controls autoplay muted loop playsinline
              ></video>
            </template>
            <img
                v-else-if="!hasMedia && safeGem.image"
                :src="safeGem.image + '?tr=f-auto'"
                :alt="safeGem.name"
                class="w-full h-full rounded-lg object-cover"
            />
            <div v-else-if="!hasMedia" class="w-full h-full bg-gray-300 rounded-lg shadow-lg animate-pulse"></div>

            <button
                v-if="hasMedia && allMedia.length > 1"
                @click="prevMedia"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow z-10"
                aria-label="Previous media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
                v-if="hasMedia && allMedia.length > 1"
                @click="nextMedia"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow z-10"
                aria-label="Next media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>

          <div
              v-if="hasMedia && allMedia.length > 1"
              class="flex gap-2 mt-4 flex-wrap justify-center"
          >
            <div
                v-for="(media, idx) in allMedia"
                :key="media.url + idx"
                class="w-16 h-16 rounded-lg cursor-pointer border-2 bg-gray-200 relative overflow-hidden"
                :class="idx === activeIndex ? 'border-emerald-600' : 'border-transparent opacity-80 hover:opacity-100'"
                @click="activeIndex = idx"
            >
              <img
                  v-if="media.thumbnailUrl"
                  :src="media.thumbnailUrl + '?tr=f-auto'"
                  :alt="`${safeGem.name} thumb ${idx + 1}`"
                  class="w-full h-full object-cover rounded"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-black rounded">
                <svg class="w-8 h-8 text-white opacity-70" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-3 space-y-4">
          <p v-if="safeGem.price" class="text-2xl font-semibold">
            €{{ safeGem.price.toLocaleString('de-DE') }}
          </p>

          <div class="text-base leading-relaxed pt-4 border-t border-gray-300">
            <p class="mb-4 whitespace-pre-wrap">{{ safeGem.description }}</p>
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
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          <GemCard v-for="related in relatedGems" :key="related.id" :gem="related" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import GemCard from "../../components/GemCard.vue"; // Adjust path if needed
import type { Gem } from "../../models/Gem.ts";       // Adjust path if needed
import { fetchGems, fetchGemById } from "../../gem.ts"; // Adjust path if needed

const route = useRoute();
const gem = ref<Gem | null>(null);
const relatedGems = ref<Gem[]>([]);
const activeIndex = ref(0);

type MediaItem = {
  type: 'image' | 'vimeo' | 'youtube' | 'file';
  url: string;
  embedUrl?: string;
  thumbnailUrl?: string;
};

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string): string | null => {
  const regExp = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const parseMediaUrl = (url: string): MediaItem | null => {
  if (!url) return null;
  try {
    const youtubeId = getYouTubeId(url);
    if (youtubeId) {
      return {
        type: 'youtube', url: url,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3`,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
      };
    }

    const vimeoId = getVimeoId(url);
    if (vimeoId) {
      return {
        type: 'vimeo', url: url,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&background=1`,
        thumbnailUrl: `https://vumbnail.com/${vimeoId}_medium.jpg`
      };
    }

    const imagekitEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '';
    if (url.startsWith(imagekitEndpoint)) {
      const path = url.replace(imagekitEndpoint, '');
      const urlLower = url.toLowerCase();
      if (['.mp4', '.mov', '.webm', '.avi', '.mkv'].some(ext => urlLower.endsWith(ext))) {
        return {
          type: 'file', url: url,
          thumbnailUrl: `${imagekitEndpoint}tr=ik-video,co-0,c-at_max,h-100,w-100/${path}`
        };
      }
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.dng'].some(ext => urlLower.endsWith(ext))) {
        return { type: 'image', url: url, thumbnailUrl: url };
      }
    }

    if (url.match(/\.(jpeg|jpg|gif|png|webp|dng)$/i)) {
      return { type: 'image', url: url, thumbnailUrl: url };
    }

    console.warn("Could not determine media type for URL:", url);

  } catch (e) { console.error("Error parsing media URL:", url, e); }
  return null;
};

const allMedia = computed((): MediaItem[] => {
  const images = (safeGem.value.images || [])
      .map(url => parseMediaUrl(url))
      .filter((item): item is MediaItem => item !== null && item.type === 'image');

  const videos = (safeGem.value.videos || [])
      .map(parseMediaUrl)
      .filter((item): item is MediaItem => item !== null && (item.type === 'youtube' || item.type === 'vimeo' || item.type === 'file'));

  const allImages = [...images];
  if (safeGem.value.image && !allImages.some(img => img.url === safeGem.value.image)) {
    const mainImageItem = parseMediaUrl(safeGem.value.image);
    if (mainImageItem?.type === 'image') {
      allImages.unshift(mainImageItem);
    }
  }

  return [...allImages, ...videos];
});

const hasMedia = computed(() => allMedia.value.length > 0);

const activeMediaItem = computed((): MediaItem | null => {
  if (!hasMedia.value) return null;
  const index = Math.max(0, Math.min(activeIndex.value, allMedia.value.length - 1));
  return allMedia.value[index];
});

const nextMedia = () => {
  if (!hasMedia.value || allMedia.value.length < 2) return;
  activeIndex.value = (activeIndex.value + 1) % allMedia.value.length;
};

const prevMedia = () => {
  if (!hasMedia.value || allMedia.value.length < 2) return;
  activeIndex.value = (activeIndex.value - 1 + allMedia.value.length) % allMedia.value.length;
};

const loadGem = async (id: string) => {
  gem.value = null;
  activeIndex.value = 0;
  try {
    const data = await fetchGemById(id);
    if (!data) throw new Error("Gem not found!");
    gem.value = data;

    const all = await fetchGems();
    relatedGems.value = all
        .filter(g => g.id !== id && g.category === data.category)
        .slice(0, 3);
    if (relatedGems.value.length < 3) {
      const otherGems = all.filter(g => g.id !== id && g.category !== data.category);
      relatedGems.value.push(...otherGems.slice(0, 3 - relatedGems.value.length));
    }

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
    (newId, oldId) => {
      if (newId && newId !== oldId) {
        loadGem(newId as string);
        window.scrollTo(0, 0);
      }
    },
    { immediate: true }
);

const safeGem = computed<Gem>(() => gem.value || {
  id: "", name: "Loading...", description: "", price: 0,
  image: "", images: [], videos: [], isNew: false, category: "", subcategory: "",
  status: "", origin: "", weight: "", dimensions: "", treatment: "", clarity: "", cut: ""
});
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>