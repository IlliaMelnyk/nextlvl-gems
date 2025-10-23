<template>
  <div
      class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
      @click="goToGemDetail"
  >
    <!-- Obrázek -->
    <div class="h-52 bg-gray-100">
      <img :src="gem.image || '/placeholder.png'" :alt="gem.name" class="w-full h-full object-cover" />
    </div>

    <!-- Obsah -->
    <div class="p-4 text-gray-800">
      <h3 class="text-lg font-semibold truncate">{{ gem.name }}</h3>
      <p class="text-sm text-gray-500 line-clamp-2">{{ gem.description }}</p>

      <div class="mt-3 flex items-center justify-between">
        <!-- Cenu můžeš zase zapnout -->
        <!-- <span v-if="gem.price" class="text-emerald-700 font-bold">{{ gem.price }} €</span> -->
        <span class="text-sm px-3 py-1 rounded-full bg-emerald-600 text-white hover:bg-amber-500 transition">
          View
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Gem } from "../models/Gem";

const props = defineProps<{
  gem: Gem;
}>();

const router = useRouter();

const goToGemDetail = () => {
  router.push(`/product/${props.gem.id}`);
};
</script>
