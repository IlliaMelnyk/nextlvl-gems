<template>
  <div class="bg-gray-100 text-black min-h-screen">
    <header
        class="w-full  top-0 left-0 z-40 transition-colors "
        :class="navbarClass"
    >
      <div class="max-w-[1200px] mx-auto flex items-center justify-between py-5 px-6">
        <router-link to="/" class="text-xl font-bold tracking-wide hover:opacity-80 ">
          Nextlevel Gems
        </router-link>
      </div>
    </header>

    <section class="max-w-4xl mx-auto px-6 pb-20">
      <!-- Title -->
      <h2 class="text-3xl font-bold text-center mb-4">All Products</h2>

      <!-- Search + Sort -->
      <div class="flex flex-col md:flex-row gap-4 mb-10 w-full ">
        <!-- Search -->
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Search..."
            class="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <!-- Sort -->
        <select
            v-model="sortOption"
            class="flex-1 md:flex-none border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="carat">Sort by Carat</option>
        </select>
      </div>

      <!-- Gems grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <GemCard
            v-for="gem in filteredGems"
            :key="gem.id"
            :gem="gem"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Navbar from "../../components/Navbar.vue";
import GemCard from "../../components/GemCard.vue";
import type { Gem } from "../../models/Gem";

// Mock data – můžeš později napojit na backend
const gems = ref<Gem[]>([
  {
    id: "1",
    name: "Sapphire",
    description: "Blue sapphire",
    carat: 0.51,
    images: ["/saphire-1.png"],
    price: 800,
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
]);

const searchQuery = ref("");
const sortOption = ref("name");

const filteredGems = computed(() => {
  let list = gems.value.filter((gem) =>
      gem.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (sortOption.value === "price") {
    list = list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  } else if (sortOption.value === "carat") {
    list = list.sort((a, b) => (a.carat ?? 0) - (b.carat ?? 0));
  } else {
    list = list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
});
</script>
