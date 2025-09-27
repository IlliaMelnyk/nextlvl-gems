<template>
  <header
      class="w-full fixed top-0 left-0 z-40 transition-colors duration-300"
      :class="navbarClass"
  >
    <div class="max-w-[1200px] mx-auto flex items-center justify-between py-5 px-6">
      <!-- Logo -->
      <router-link to="/" class="text-xl font-bold tracking-wide hover:opacity-80 transition">
        Nextlevel Gems
      </router-link>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6">
        <!-- One-page anchors -->
        <a href="#home" class="hover:underline">Home</a>
        <a href="#new-gems" class="hover:underline">New Gems</a>
        <a href="#about" class="hover:underline">About us</a>
        <a href="#contact" class="hover:underline">Contact</a>

        <!-- Router view -->
        <router-link to="/products" class="hover:underline">All products</router-link>
      </nav>

      <!-- Mobile button -->
      <button
          class="md:hidden"
          @click="open = !open"
          aria-label="Toggle menu"
      >
        <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="fade">
      <div v-if="open" class="md:hidden bg-black/80 text-white">
        <div class="px-6 py-4 space-y-3">
          <a href="#home" @click="open = false" class="block">Home</a>
          <a href="#about" @click="open = false" class="block">About us</a>
          <a href="#contact" @click="open = false" class="block">Contact</a>
          <router-link @click="open = false" to="/products" class="block">All products</router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";

const open = ref(false);
const scrolled = ref(false);
const route = useRoute();

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Když jsem na homepage → mění se podle scrollu
// Jinak (např. /products) → vždy bílé pozadí + černý text
const navbarClass = computed(() => {
  if (route.path === "/") {
    return scrolled.value
        ? "bg-gray-200 text-black shadow"
        : "bg-transparent text-white";
  } else {
    return "bg-gray-100 text-black";
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<style>
/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>
