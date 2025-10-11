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
        <!-- Obrázky / Carousel -->
        <div class="md:col-span-2 flex flex-col items-center relative">
          <!-- Hlavní obrázek -->
          <div class="relative w-full max-w-md">
            <img
                v-if="hasImages"
                :src="safeGem.images[activeIndex]"
                :alt="`${safeGem.name} image ${activeIndex + 1}`"
                class="w-full h-auto rounded-lg shadow-lg object-cover transition-all duration-300"
            />
            <img
                v-else-if="safeGem.image"
                :src="safeGem.image"
                :alt="safeGem.name"
                class="w-full h-auto rounded-lg shadow-lg object-cover"
            />
            <div
                v-else
                class="w-full h-80 bg-gray-200 rounded-lg shadow-lg animate-pulse"
            ></div>

            <!-- Navigační šipky -->
            <button
                v-if="hasImages"
                @click="prevImage"
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
                v-if="hasImages"
                @click="nextImage"
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

          <!-- Mini náhledy -->
          <div
              v-if="hasImages"
              class="flex gap-2 mt-4 flex-wrap justify-center"
          >
            <img
                v-for="(img, idx) in safeGem.images"
                :key="idx"
                :src="img"
                :alt="`${safeGem.name} thumb ${idx + 1}`"
                class="w-16 h-16 object-cover rounded-lg cursor-pointer border transition-all duration-200"
                :class="idx === activeIndex ? 'border-2 border-emerald-600' : 'border-transparent opacity-80 hover:opacity-100'"
                @click="activeIndex = idx"
            />
          </div>
        </div>

        <!-- Detaily kamene -->
        <div class="md:col-span-3 space-y-4">
          <p v-if="safeGem.price" class="text-2xl font-semibold">
            €{{ safeGem.price.toLocaleString('de-DE') }}
          </p>
          <p class="text-gray-600">
            Tax included.
            <span class="underline cursor-pointer">Shipping not included</span>
          </p>

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

      <!-- Related -->
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

// Carousel stav
const activeIndex = ref(0);
const hasImages = computed(() => gem.value?.images && gem.value.images.length > 0);

const nextImage = () => {
  if (!hasImages.value) return;
  activeIndex.value = (activeIndex.value + 1) % gem.value!.images.length;
};

const prevImage = () => {
  if (!hasImages.value) return;
  activeIndex.value =
      (activeIndex.value - 1 + gem.value!.images.length) % gem.value!.images.length;
};

// Načtení dat
const loadGem = async (id: string) => {
  try {
    const data = await fetchGemById(id);
    if (!data) throw new Error("Gem not found!");
    gem.value = data;

    const all = await fetchGems();
    relatedGems.value = all.filter((g) => g.id !== id).slice(0, 3);
    activeIndex.value = 0;
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

const safeGem = computed<Gem>(() => gem.value || {
  id: "",
  name: "Načítání...",
  description: "",
  image: "",
  images: [],
  price: 0,
  isNew: false,
});
</script>

<style scoped>
img {
  transition: opacity 0.3s ease;
}
</style>
