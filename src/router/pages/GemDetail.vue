<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import GemCard from "../../components/GemCard.vue";
import type { Gem } from "../../models/Gem.ts"; // Import z upraveného modelu
import { fetchGems, fetchGemById } from "../../gem.ts"; // Předpokládám, že máš nějaký service soubor

const route = useRoute();
const gem = ref<Gem | null>(null);
const relatedGems = ref<Gem[]>([]);

const loadGem = async (id: string) => {
  try {
    const data = await fetchGemById(id);
    if (!data) throw new Error("Gem not found!");
    gem.value = data;

    const all = await fetchGems();
    // Zobrazí až 3 podobné produkty
    relatedGems.value = all.filter((g) => g.id !== id).slice(0, 3);
  } catch (err) {
    console.error("Error fetching gem:", err);
  }
};

// První načtení dat při zobrazení komponenty
onMounted(() => {
  if (route.params.id) {
    loadGem(route.params.id as string);
  }
});

// Reakce na změnu ID v URL (když uživatel klikne na podobný produkt)
watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        loadGem(newId as string);
        window.scrollTo(0, 0); // Posune stránku nahoru
      }
    }
);

// Bezpečnostní computed property, aby stránka nespadla, když se data ještě načítají
const safeGem = computed<Gem>(() => gem.value || {
  id: "",
  name: "Načítání...",
  description: "",
  image: "",
  price: 0,
  isNew: false,
});
</script>

<template>
  <div class="bg-gray-100 text-black min-h-screen">
    <section class="max-w-6xl mx-auto px-6 pt-5 pb-12">
      <router-link
          to="/products"
          class="flex items-center text-emerald-600 hover:text-emerald-800 w-fit mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Products
      </router-link>

      <h1 class="text-3xl font-bold text-center mb-8">
        {{ safeGem.name }}
      </h1>

      <div class="grid md:grid-cols-5 gap-8">
        <div class="md:col-span-2 flex justify-center items-start">
          <img
              v-if="safeGem.image"
              :src="safeGem.image"
              :alt="safeGem.name"
              class="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
          />
          <div v-else class="w-full max-w-md h-80 bg-gray-200 rounded-lg shadow-lg animate-pulse"></div>
        </div>

        <div class="md:col-span-3 space-y-4">
          <p v-if="safeGem.price" class="text-2xl font-semibold">
            €{{ safeGem.price.toLocaleString('de-DE') }}
          </p>
          <p class="text-gray-600">
            Tax included. <span class="underline cursor-pointer">Shipping not included</span>
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

      <div v-if="relatedGems.length > 0" class="mt-20">
        <h2 class="text-2xl font-bold text-center mb-8">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GemCard
              v-for="related in relatedGems"
              :key="related.id"
              :gem="related"
          />
        </div>
      </div>
    </section>
  </div>
</template>