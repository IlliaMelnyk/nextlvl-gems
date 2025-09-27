<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <main class="max-w-6xl mx-auto px-6 py-20">
      <h1 class="text-3xl font-bold mb-8 text-center text-emerald-800">New Gems</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <GemCard
            v-for="gem in newGems"
            :key="gem.id"
            :gem="gem"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../../components/Navbar.vue";
import GemCard from "../../components/GemCard.vue";
import type { Gem } from "../../models/Gem";

// Mock data zatím
const allGems: Gem[] = [
  {
    id: "1",
    name: "Emerald Radiance",
    description: "Brilliant green emerald with perfect clarity.",
    price: 1200,
    images: ["/emerald-1.png"],
    isNew: true,
    carat: 2.3,
    color: "Green",
    origin: "Colombia",
  },
  {
    id: "2",
    name: "Ruby Flame",
    description: "Deep red ruby with fiery brilliance.",
    price: 1500,
    images: ["/ruby-1.png"],
    isNew: true,
    carat: 1.8,
    color: "Red",
    origin: "Burma",
  },
  {
    id: "3",
    name: "Sapphire Sky",
    description: "Blue sapphire as clear as the sky.",
    price: 980,
    images: ["/saphire-1.png"],
    isNew: true,
    carat: 2.1,
    color: "Blue",
    origin: "Sri Lanka",
  },
];

// vyfiltrujeme jen nové kameny
const newGems = allGems.filter(g => g.isNew);
</script>