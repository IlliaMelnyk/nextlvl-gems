<template>
  <div
      class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
  >
    <!-- Obrázek -->
    <div class="h-52 bg-gray-100">
      <img
          :src="gem.images[0]"
          :alt="gem.name"
          class="w-full h-full object-cover"
      />
    </div>

    <!-- Obsah -->
    <div class="p-4 text-gray-800">
      <h3 class="text-lg font-semibold truncate">{{ gem.name }}</h3>
      <p class="text-sm text-gray-500 line-clamp-2">{{ gem.description }}</p>

      <div class="mt-3 flex items-center justify-between">
        <span v-if="gem.price" class="text-emerald-700 font-bold">{{ gem.price }} €</span>
        <router-link
            :to="`/product/${gem.id}`"
            class="text-sm px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-amber-500 transition"
        >
          View
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Gem } from "../models/Gem";

defineProps<{
  gem: Gem;
}>();
</script>
