<template>
  <div class="bg-gray-100 text-black min-h-screen">
    <section class="max-w-6xl mx-auto px-6 pt-5 pb-3">
      <router-link
          to="/products"
          class="flex items-center text-emerald-600 hover:text-emerald-800  w-fit"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-5 h-5 mr-2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Products
      </router-link>

      <!-- Název -->
      <h1 class="text-3xl font-bold text-center mb-8">
        {{ gem.name }} {{ gem.carat ? gem.carat + " ct" : "" }}
      </h1>

      <div class="grid md:grid-cols-5 gap-7">
        <!-- Galerie -->
        <div class="flex flex-col gap-2">
          <img
              v-for="(img, i) in gem.images"
              :key="i"
              :src="img"
              :alt="gem.name"
              class="w-20 h-20 object-cover rounded cursor-pointer border hover:ring-2 hover:ring-emerald-500"
              @click="selectedImage = img"
          />
        </div>

        <!-- Hlavní obrázek -->
        <div class="flex justify-center items-center md:col-span-2">
          <img
              :src="selectedImage"
              :alt="gem.name"
              class="w-full max-w-md h-68 rounded shadow"
          />
        </div>

        <!-- Info -->
        <div class="md:col-span-2 space-y-4">
          <p v-if="gem.price" class="text-xl font-semibold">
            €{{ gem.price.toFixed(2) }}
          </p>
          <p class="text-gray-600">
            Tax included. <span class="underline cursor-pointer">Shipping not included</span>
          </p>

          <div class="text-sm leading-relaxed">
            <p>{{ gem.description }}</p>
            <ul class="mt-4 space-y-1">
              <li v-if="gem.carat"><b>Carat Weight:</b> {{ gem.carat }} ct</li>
              <li v-if="gem.color"><b>Color:</b> {{ gem.color }}</li>
              <li v-if="gem.cut"><b>Cut:</b> {{ gem.cut }}</li>
              <li v-if="gem.origin"><b>Origin:</b> {{ gem.origin }}</li>
              <li v-if="gem.treatment"><b>Treatment:</b> {{ gem.treatment }}</li>
              <li v-if="gem.clarity"><b>Clarity:</b> {{ gem.clarity }}</li>
              <li v-if="gem.measurements"><b>Measurements:</b> {{ gem.measurements }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Related products -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-center mb-6">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../../components/Navbar.vue";
import GemCard from "../../components/GemCard.vue";
import type { Gem } from "../../models/gem";

// Simulovaná databáze (mock)
const allGems: Gem[] = [
  {
    id: "1",
    name: "Sapphire",
    description: "A fantastic unheated pink sapphire from Madagascar.",
    carat: 0.51,
    price: 450,
    images: ["/saphire-1.png", "/saphire-2.png", "/saphire-3.png"],
    color: "Pink",
    origin: "Madagascar",
    clarity: "Eyeclean",
    cut: "Trillion",
    treatment: "None",
    measurements: "5.2 x 5.2 x 3.0 mm",
  },
  {
    id: "2",
    name: "Ruby",
    description: "Red ruby",
    carat: 0.51,
    images: ["/ruby-1.png"],
    price: 1200,
  },
  {
    id: "3",
    name: "Amethyst",
    description: "Purple amethyst",
    carat: 0.51,
    images: ["/emerald-1.png"],
    price: 400,
  },
];

// vezmeme ID z route
const route = useRoute();
const gemId = route.params.id as string;

// hlavní gem
const gem = allGems.find((g) => g.id === gemId) as Gem;

// fallback, kdyby ID nebylo nalezeno
if (!gem) {
  throw new Error("Gem not found!");
}

const selectedImage = ref(gem.images[0]);

// related produkty – všechny kromě aktuálního
const relatedGems = computed(() => allGems.filter((g) => g.id !== gemId));
</script>
